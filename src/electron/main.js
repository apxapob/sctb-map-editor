const { app, BrowserWindow, globalShortcut } = require('electron')
const { initHotKeys } = require('./hotKeys')
const { messengerInit } = require('./messenger')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
    show: false
  })

  if(app.isPackaged){
    win.loadFile('public/index.html')
  } else {
    win.loadURL('http://localhost:3000')
  }
  
  initHotKeys(win)
  
  win.once('ready-to-show', () => win.maximize())
  exports.mainWindow = win
}

app.whenReady().then(() => {
  createWindow()
  
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
