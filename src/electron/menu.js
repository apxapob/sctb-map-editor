const { app, Menu, MenuItem } = require('electron')
const { openMap, saveMap } = require('./commands')
const { sendCommand } = require('./messenger')

exports.getMenu = win => {
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'File',
    submenu: [
      {
        label: 'New map',
        accelerator: 'CmdOrCtrl+N',
        click: () => sendCommand({ command: 'NEW_MAP' }),
      },
      {
        label: 'Open map',
        accelerator: 'CmdOrCtrl+O',
        click: () => openMap(),
      },
      {
        label: 'Save map',
        accelerator: 'CmdOrCtrl+S',
        click: () => saveMap(),
      },
      {
        label: 'Open dev tools',
        accelerator: 'CmdOrCtrl+F12',
        click: () => win.webContents.openDevTools(),
      },
      {
        label: 'Close map',
        accelerator: 'F5',
        click: () => win.webContents.reload(),
      },
      {
        label: 'Exit',
        click: () => app.quit(),
      },
    ]
  }))
  return menu
}
