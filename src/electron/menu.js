const { app, Menu, MenuItem } = require('electron')
const { openMap } = require('./commands')

exports.getMenu = win => {
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'File',
    submenu: [
      {
        label: 'New map',
        accelerator: 'CmdOrCtrl+N',
        click: () => win.webContents.send('commands', { command: 'NEW_MAP' }),
      },
      {
        label: 'Open map',
        accelerator: 'CmdOrCtrl+O',
        click: () => openMap(),
      },
      {
        label: 'Save map',
        accelerator: 'CmdOrCtrl+S',
        click: () => console.log('!!!save'),
      },
      {
        label: 'Open dev tools',
        accelerator: 'CmdOrCtrl+F12',
        click: () => win.webContents.openDevTools(),
      },
      {
        label: 'Reload map editor',
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
