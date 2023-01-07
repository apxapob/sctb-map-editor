const { ipcMain } = require('electron')

exports.messengerInit = () => {
  ipcMain.on('commands', handleCommand)
}

const handleCommand = (event, message) => {
  const commandHandler = require('./commands')[message.command]
  if (!commandHandler) {
    console.error('Unkkown command:', message.command)
  } else {
    commandHandler(message)
  }
}

exports.sendCommand = c => {
  const { mainWindow } = require('./main')
  mainWindow.webContents.send('commands', c)
}
