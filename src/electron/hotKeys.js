const { app, globalShortcut } = require('electron')
const { sendCommand } = require('./messenger')

exports.initHotKeys = (win) => {
  app.whenReady().then(() => {
    globalShortcut.register( 'CmdOrCtrl+S', () => sendCommand({ command: 'SAVE_CHANGES' }) )
    globalShortcut.register( 'CmdOrCtrl+F8', () => sendCommand({ command: 'JSON_MODE' }) )
    //globalShortcut.register( 'F11', () => {win.fullScreen = !win.fullScreen} )//works without hotkey
    globalShortcut.register( 'F9', () => sendCommand({ command: 'TEST_MAP' }) )
    
    if(!app.isPackaged){
      win.webContents.openDevTools()
      globalShortcut.register( 'F5', () => win.webContents.reload() )
    }
  })
}
