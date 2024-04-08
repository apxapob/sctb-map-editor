const fs = require('fs')
const steamworks = require('steamworks.js')
const { SteamEnabled } = require('./consts')
const { compress, decompress } = require('./StringUtils')
const { sendCommand } = require('./messenger')

const steamApiKey = "770FA3A0DFB018C867BD8DD60D3DACAB"

let client = null
let curLobby = null

exports.InitAPI = () => {
  if(!SteamEnabled) return
  console.log("Steam Api init")
  //2865970 - playtest id
  //2860520 - main game id
  client = steamworks.init(2865970)//pass steam app api here
  //console.log("client", client)
  steamworks.electronEnableSteamOverlay()

  console.log("Steam Cloud enabled:", client?.cloud.isEnabledForAccount(), client?.cloud.isEnabledForApp())

  client.callback.register(client.callback.SteamCallback.LobbyChatUpdate, data => {
    if(!curLobby) return
    sendCommand({
      command: 'TO_GAME', 
      data: {
        method: 'lobby_change',
        players: curLobby.getMembers().map(id => id.steamId64 + '')
      }
    })
  })

  setInterval(receiveMessages, 100)
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

exports.gameStarted = () => {
  curLobby?.setJoinable(false)
}

exports.openInviteDialog = () => {
  curLobby?.openInviteDialog()
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

receiveMessages = async () => {
  const messages = await client?.networking_messages.receiveMessagesOnChannel()
  for(let i in messages){
    const m = messages[i]
    const fromId = (m.steamId?.steamId64) + ''
    const msg = JSON.parse(await decompress(m.data))
    sendCommand({
      command: 'TO_GAME',
      data: {
        method: 'on_received_msg',
        from: fromId,
        msg
      }
    })
  }
}

exports.getUsersData = async users => {
  if(!users || users.lenth < 1) return []
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${steamApiKey}&steamids=${users.join()}`
  const response = await fetch(url)
  const data = await response.json()
  
  /*{
    steamid : 76561198048572879,
    personaname : Popcorn, 
    avatar : https://avatars.steamstatic.com/09e64aee9a10d9016021a0d315be5e1e0c3f2cbc.jpg, 
    avatarmedium : https://avatars.steamstatic.com/09e64aee9a10d9016021a0d315be5e1e0c3f2cbc_medium.jpg, 
    avatarfull : https://avatars.steamstatic.com/09e64aee9a10d9016021a0d315be5e1e0c3f2cbc_full.jpg, 
    avatarhash : 09e64aee9a10d9016021a0d315be5e1e0c3f2cbc, 
  }*/
  
  return await Promise.all(data.response.players.map(
    async pl => {
      try{
        const avaResp = await fetch(pl.avatarmedium)
        const blob = await avaResp.blob()
        const avatar = (await blob.stream().getReader().read()).value

        return { id: pl.steamid, name: pl.personaname, avatar }
      } catch (e) {
        console.error("Load avatar error:", e)
        return { id: pl.steamid, name: pl.personaname }
      }
    }
  ))
}