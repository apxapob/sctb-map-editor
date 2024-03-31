const { sendCommand } = require('./messenger')
const { DebugMode } = require('./consts')

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
    }
    
    if (input.control || input.command || DebugMode){
      if(input.key.toLowerCase() === 'f5') {
        win.webContents.reload()
      }
      if(input.key.toLowerCase() === 'f11') {
        win.webContents.openDevTools()
      }
    }
  })

}
