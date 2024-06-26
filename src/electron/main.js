const { app, BrowserWindow } = require('electron')
const { initHotKeys } = require('./hotKeys')
const { messengerInit } = require('./messenger')
const { DebugMode } = require('./consts')
const { InitAPI } = require('./steamApi')

InitAPI()

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false
  })

  win.setMenu(null)

  if(app.isPackaged && !DebugMode){
    win.loadFile('./dist/index.html')
  } else {
    //win.loadURL('http://localhost:3000')
    win.loadURL('http://192.168.56.1:3000/')
  }
  
  initHotKeys(win)

  if(DebugMode){
    win.webContents.openDevTools()
  }
  
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
