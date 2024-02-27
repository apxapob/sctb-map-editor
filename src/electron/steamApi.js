const steamworks = require('steamworks.js')
const fs = require('fs')

let client = null 

exports.InitAPI = () => {
  console.log("Steam Api init")
  client = steamworks.init(2860520)//pass steam app api here
  
  steamworks.electronEnableSteamOverlay()
}

exports.GetPlayerName = () => client?.localplayer?.getName()
exports.GetPlayerId = () => client?.localplayer?.getSteamId().accountId
exports.CloudEnabled = () => client?.cloud.isEnabledForAccount() && client?.cloud.isEnabledForApp()

exports.readFile = async (name) => {
  if(exports.CloudEnabled()) return client?.cloud.readFile(name)
  else return await fs.promises.readFile(name, { encoding: 'utf8' })
}
exports.writeFile = async (name, content) => {
  if(exports.CloudEnabled()) client?.cloud.writeFile(name, content)
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