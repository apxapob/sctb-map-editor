const { app, BrowserWindow, Menu, MenuItem, globalShortcut } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false
  })

  win.loadURL('http://localhost:3000')
  
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'File',
    submenu: [
      {
        label: 'New map',
        accelerator: 'CmdOrCtrl+N',
        click: () => win.webContents.send('electron-message', { command: 'NEW_MAP' }),
      },
      {
        label: 'Open map',
        accelerator: 'CmdOrCtrl+O',
        click: () => console.log('!!!open'),
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

  win.setMenu(menu)
  //win.loadFile('public/index.html')
  win.once('ready-to-show', () => win.show())
  return win
}

app.whenReady().then(() => {
  const win = createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
  
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
