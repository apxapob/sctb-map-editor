const fs = require('fs')
const steamworks = require('steamworks.js')
const { SteamEnabled } = require('./consts')
const { compress, decompress } = require('./StringUtils')

let client = null
let curLobby = null

exports.InitAPI = () => {
  if(!SteamEnabled) return
  console.log("Steam Api init")
  //2865970 - playtest id
  //2860520 - main game id
  client = steamworks.init(2865970)//pass steam app api here
  console.log("client", client)
  steamworks.electronEnableSteamOverlay()

  console.log("Steam Cloud enabled:", client?.cloud.isEnabledForAccount(), client?.cloud.isEnabledForApp())
}

exports.GetPlayerName = () => client?.localplayer?.getName() ?? "Player " + Math.floor(1 + Math.random() * 9998)
exports.GetPlayerId = () => client?.localplayer?.getSteamId().steamId64 + ''
exports.CloudEnabled = () => !!(client?.cloud.isEnabledForAccount() && client?.cloud.isEnabledForApp())

exports.readFile = async (name) => {
  if(exports.CloudEnabled()) return client?.cloud.readFile(name)
  else return await fs.promises.readFile(name, { encoding: 'utf8' })
}
exports.writeFile = async (name, content) => {
  if(exports.CloudEnabled()) return client?.cloud.writeFile(name, content)
  else await fs.promises.writeFile(name, content)
}

exports.deleteFile = async (name) => {
  if(exports.CloudEnabled()) client?.cloud.deleteFile(name)
  else await fs.promises.rm(name)
}

exports.fileExists = async (name) => {
  if(exports.CloudEnabled()) return client?.cloud.fileExists(name)
  else return await fs.promises.fileExists(name)
}

const lobbyToJSObj = lobby => ({
  id: lobby.id + '',
  name: lobby.getData("name"),
  membersCount: lobby.getMemberCount(),
  maxPlayers: lobby.getMemberLimit(),
  players: lobby.getMembers().map(id => id.steamId64 + ''),
  ownerId: lobby.getOwner().steamId64 + ''
})

exports.getLobbies = async () => {
  return (await client?.matchmaking.getLobbies()).map(lobbyToJSObj)
}

exports.createLobby = async (isPrivate) => {
  curLobby = await client?.matchmaking.createLobby(isPrivate ? 0 : 2, 20)
  curLobby.setData("name", exports.GetPlayerName())
  return lobbyToJSObj(curLobby)
}

exports.joinLobby = async (lobbyId) => {
  try{
    curLobby = await client?.matchmaking.joinLobby(BigInt(lobbyId))
    return lobbyToJSObj(curLobby)
  } catch (e){
    console.error(e)
  }
  return null
}

exports.leaveLobby = () => {
  curLobby?.leave()
  curLobby = null
}

exports.sendMessage = async (userId, data) => {
  try {
    const buf = await compress(JSON.stringify(data), true)
    await client?.networking_messages.sendMessageToUser(BigInt(userId), buf)
  } catch (e){
    console.error(e)
  }
}

exports.receiveMessages = async () => {
  return await client?.networking_messages.receiveMessagesOnChannel()
}