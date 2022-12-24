const { app, BrowserWindow, globalShortcut } = require('electron')
const { getMenu } = require('./menu')
const { messengerInit } = require('./messenger')

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

  win.setMenu(getMenu(win))
  //win.loadFile('public/index.html')
  win.once('ready-to-show', () => win.show())
  return win
}

app.whenReady().then(() => {
  exports.mainWindow = createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  messengerInit()
})
  
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
