const steamworks = require('steamworks.js')

let client = null 

exports.InitAPI = () => {
  console.log("Steam Api init")
  client = steamworks.init(2860520)//pass steam app api here
  
  steamworks.electronEnableSteamOverlay()
}

exports.GetPlayerName = () => {
  return client?.localplayer?.getName()
}