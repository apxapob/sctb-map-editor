const fs = require('fs')
const steamworks = require('steamworks.js')
const { SteamEnabled } = require('./consts')

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

exports.GetPlayerName = () => client?.localplayer?.getName() ?? "Player"
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
  id: lobby.id,
  membersCount: lobby.getMemberCount(),
  membersLimit: lobby.getMemberLimit(),
  members: lobby.getMembers().map(id => id.steamId64 + ''),
  owner: lobby.getOwner().steamId64 + ''
})

exports.getLobbies = async () => {
  return (await client?.matchmaking.getLobbies()).map(lobbyToJSObj)
}

exports.createLobby = async (isPrivate) => {
  curLobby = await client?.matchmaking.createLobby(isPrivate ? 0 : 2, 20)
  return lobbyToJSObj(curLobby)
}

exports.joinLobby = async (lobbyId) => {
  curLobby = await client?.matchmaking.joinLobby(lobbyId)
  return lobbyToJSObj(curLobby)
}

exports.leaveLobby = () => {
  curLobby.leave()
  curLobby = null
}

exports.sendMessage = async (userId, data) => {
  await client?.networking_messages.sendMessageToUser(userId, data)
}

exports.receiveMessages = async () => {
  return client?.networking_messages.receiveMessagesOnChannel()
}