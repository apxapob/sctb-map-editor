const { ipcMain } = require('electron')

exports.messengerInit = () => {
  ipcMain.on('commands', handleCommand)
}

const handleCommand = (event, message) => {
  const { openMap } = require('./commands')
  switch (message.command) {
    case 'OPEN_MAP':
      openMap()
      return
  }
}

exports.sendCommand = c => {
  const { mainWindow } = require('./main')
  mainWindow.webContents.send('commands', c)
}  
