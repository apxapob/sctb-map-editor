const { app, globalShortcut } = require('electron')
const { sendCommand } = require('./messenger')

exports.initHotKeys = (win) => {

  win.webContents.on('before-input-event', (event, input) => {
    if(input.type !== 'keyUp'){ return; }
    
    if (input.control || input.command){
      if(input.code === 'KeyS') {
        sendCommand({ command: 'SAVE_CHANGES' })
      }
      if(input.key.toLowerCase() === 'f9') {
        sendCommand({ command: 'TEST_MAP' })
      }
      return
    }

    if(!app.isPackaged){
      if(input.key.toLowerCase() === 'f5') {
        win.webContents.reload()
      }
      if(input.key.toLowerCase() === 'f12') {
        win.webContents.openDevTools()
      }
    }
     
  })

}
