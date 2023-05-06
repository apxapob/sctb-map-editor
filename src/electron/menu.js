const { app, Menu, MenuItem } = require('electron')
const { sendCommand } = require('./messenger')

exports.getMenu = win => {
  const menu = new Menu()
  menu.append(
    new MenuItem({
      label: 'File',
      submenu: [
        {
          label: 'New map',
          accelerator: 'CmdOrCtrl+N',
          click: () => require('./commands').CREATE_MAP(),
        },
        {
          label: 'Open map',
          accelerator: 'CmdOrCtrl+O',
          click: () => require('./commands').OPEN_MAP(),
        },
        {
          label: 'Save map',
          accelerator: 'CmdOrCtrl+S',
          click: () => sendCommand({ command: 'SAVE_CHANGES' }),
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
    })
  )

  menu.append(
    new MenuItem({
      label: 'View',
      submenu: [
        {
          label: 'Json mode on/off',
          accelerator: 'F8',
          click: () => sendCommand({ command: 'JSON_MODE' })
        },
        {
          label: 'Fullscreen',
          accelerator: 'F11',
          click: () => {win.fullScreen = !win.fullScreen}
        },
      ]
    })
  )
  
  menu.append(
    new MenuItem({
      label: 'Map',
      submenu: [
        {
          label: 'Test Map',
          accelerator: 'F9',
          click: () => sendCommand({ command: 'TEST_MAP' })
        },
      ]
    })
  )

  return menu
}
