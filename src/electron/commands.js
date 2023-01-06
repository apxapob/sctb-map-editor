const { dialog } = require('electron')
const fs = require('fs')
const { sendCommand } = require('./messenger')

let mapDirectory = null

const loadMap = async mapDir => {
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
    mapDirectory = mapDir
    sendCommand({ command: 'LOADING_END' })
  } catch (err) {
    console.error(err)
    sendCommand({
      command: 'LOAD_MAP_ERROR', 
      error: err.message || 'unknown error'
    })
  }
}

exports.openMap = async () => {
  const { mainWindow } = require('./main')
  const dir = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory']
  })
  if (!dir) { return }
  
  await loadMap(dir[0])
}

exports.saveMap = async () => {
  sendCommand({ command: 'SAVE_CHANGES' })
}

exports.saveTextFile = async (path, text) => {
  if (!mapDirectory) {
    console.error('no open map')
    return
  }
  try {
    const fullPath = (mapDirectory + '\\' + path).replaceAll('/', '\\')
    
    await fs.promises.writeFile(fullPath, text)
  } catch (err) {
    dialog.showErrorBox('File error', err.message)
  }
}

exports.createMap = async (mapId, mapName, playersCount, mapSize) => {
  const { mainWindow } = require('./main')
  const dir = dialog.showSaveDialogSync(mainWindow, {
    title: 'Create Map',
    defaultPath: mapId,
    properties: ['createDirectory']
  })
  if (!dir) { return }

  try {
    await fs.promises.mkdir(dir)
    await fs.promises.writeFile(
      dir + '\\buffs.json',
      JSON.stringify({})
    )
    await fs.promises.writeFile(
      dir + '\\units.json',
      JSON.stringify({})
    )
    await fs.promises.writeFile(
      dir + '\\upgrades.json',
      JSON.stringify({})
    )
    await fs.promises.writeFile(
      dir + '\\info.json',
      JSON.stringify({  
        mapId,
        name: mapName,
        author: 'unknown',
        version: 0.01,
        startField: 'main',
        minPlayers: 2,
        maxPlayers: playersCount,
        countryColors: [
          '0xff0000','0x00ff00','0x0000ff','0x00ffff','0xff00ff','0xffff00'
        ]
      }, null, 2)
    )

    await fs.promises.mkdir(dir + '\\fields')
    await fs.promises.writeFile(
      dir + '\\fields\\main.json',
      JSON.stringify({
        size: mapSize,
        tiles: Array(mapSize * mapSize).fill([1, 0]),
        units: {},
      })
    )
    await fs.promises.mkdir(dir + '\\img')
    await fs.promises.mkdir(dir + '\\locales')
    await fs.promises.writeFile(
      dir + '\\locales\\en.json',
      JSON.stringify({ mapName: mapName }, null, 2)
    )
    
    await fs.promises.mkdir(dir + '\\particles')
    await fs.promises.mkdir(dir + '\\scripts')
    await fs.promises.mkdir(dir + '\\units')
    
    await loadMap(dir)
  } catch (err) {
    dialog.showErrorBox('Create directory error', err.message)
  }
}
