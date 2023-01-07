const { ipcMain } = require('electron')

exports.messengerInit = () => {
  ipcMain.on('commands', handleCommand)
}

const handleCommand = (event, message) => {
  const { openMap, saveTextFile, createMap, makeDirectory } = require('./commands')
  switch (message.command) {
    case 'OPEN_MAP':
      openMap()
      return
    case 'CREATE_MAP':
      createMap(message.mapId, message.mapName, message.playersCount, message.mapSize)
      return
    case 'SAVE_TEXT_FILE':
      saveTextFile(message.data.path, message.data.text)
      return
    case 'MAKE_DIR':
      makeDirectory(message.path)
      return
  }
}

exports.sendCommand = c => {
  const { mainWindow } = require('./main')
  mainWindow.webContents.send('commands', c)
}
