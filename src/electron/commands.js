const { dialog } = require('electron')
const fs = require('fs')
const { sendCommand } = require('./messenger')

let mapDir = null

exports.openMap = async () => {
  const { mainWindow } = require('./main')
  const dir = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory']
  })
  if (!dir) { return }
  
  try {
    sendCommand({ command: 'LOADING_START' })
    const files = []
    const loadDir = async path => {
      const dirFiles = await fs.promises.readdir(path, { withFileTypes: true })
      for (const file of dirFiles) {
        if (file.isDirectory()) {
          await loadDir(path + '\\' + file.name)
        } else {
          files.push(path + '\\' + file.name)
        }
      }
    }
    mapDir = dir[0]
    await loadDir(mapDir)
    
    let loaded = 0
    for (const file of files) {
      if (file.endsWith('.json') || file.endsWith('.hx')) {
        const fileText = await fs.promises.readFile(file, { encoding: 'utf8' })
        sendCommand({
          command: 'LOAD_TEXT_FILE', 
          text: fileText, 
          progress: loaded / files.length, 
          file: file.replace(mapDir + '\\', '')
        })
        loaded++
      } else {
        const fileBytes = await fs.promises.readFile(file)
        sendCommand({ 
          command: 'LOAD_BINARY_FILE', 
          bytes: fileBytes, 
          progress: loaded / files.length, 
          file: file.replace(mapDir + '\\', '')
        })
        loaded++
      }
    }

    sendCommand({ command: 'LOADING_END' })
  } catch (err) {
    console.error(err)
    sendCommand({
      command: 'LOAD_MAP_ERROR', 
      error: err.message || 'unknown error'
    })
  }
}

exports.saveMap = async () => {
  sendCommand({ command: 'SAVE_CHANGES' })
}

exports.saveTextFile = async (path, text) => {
  if (!mapDir) {
    console.error('no open map')
    return
  }
  const fullPath = (mapDir + '\\' + path).replaceAll('/', '\\')
  await fs.promises.writeFile(fullPath, text)
}
