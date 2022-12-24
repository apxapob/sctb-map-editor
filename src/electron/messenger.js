const { ipcMain } = require('electron')
const { openMap } = require('./commands')

exports.messengerInit = () => {
  ipcMain.on('commands', handleSetTitle)
}

const handleSetTitle = (event, message) => {
  switch (message.command) {
    case 'OPEN_MAP':
      openMap()
      return
  }
}

