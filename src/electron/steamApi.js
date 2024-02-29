const fs = require('fs')
const steamworks = require('steamworks.js')
const { SteamEnabled } = require('./consts')

let client = null 

exports.InitAPI = () => {
  if(!SteamEnabled) return
  console.log("Steam Api init")
  //2865970 - playtest id
  //2860520 - main game id
  client = steamworks.init(2865970)//pass steam app api here
  
  steamworks.electronEnableSteamOverlay()

  console.log("Steam Cloud enabled:", client?.cloud.isEnabledForAccount(), client?.cloud.isEnabledForApp())
}

exports.GetPlayerName = () => client?.localplayer?.getName() ?? "Player"
exports.GetPlayerId = () => client?.localplayer?.getSteamId().accountId ?? null
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