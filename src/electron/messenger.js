const { ipcMain } = require('electron')

exports.messengerInit = () => {
  ipcMain.on('commands', handleCommand)
}

const handleCommand = (event, message) => {
  const { openMap, saveTextFile } = require('./commands')
  switch (message.command) {
    case 'OPEN_MAP':
      openMap()
      return
    case 'SAVE_TEXT_FILE':
      saveTextFile(message.data.path, message.data.text)
      return
  }
}

exports.sendCommand = c => {
  const { mainWindow } = require('./main')
  mainWindow.webContents.send('commands', c)
}  

