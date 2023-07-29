const { dialog, shell, app } = require('electron')
const fs = require('fs')
const { sendCommand } = require('./messenger')
const { compress, decompress } = require('./StringUtils')

let mapDirectory = null

const getMapsDirPath = () => {
  return app.isPackaged ? './maps/' : '../sctb-client/maps/'
}
const getSaveFilesDirPath = () => {
  return app.isPackaged ? './saves/' : '../sctb-client/saves/'
}

const loadMap = async (mapDir, forEditing = false) => {
  try {
    sendCommand({ command: 'LOADING_START' })
    const files = []
    const dirs = []
    const loadDir = async path => {
      const dirFiles = await fs.promises.readdir(path, { withFileTypes: true })
      for (const file of dirFiles) {
        if (file.isDirectory()) {
          dirs.push(path + '\\' + file.name)
          await loadDir(path + '\\' + file.name)
        } else {
          files.push(path + '\\' + file.name)
        }
      }
    }

    await loadDir(mapDir)
    
    for (const dir of dirs) {
      sendCommand({
        command: 'LOAD_DIRECTORY', 
        path: dir.replace(mapDir + '\\', '')
      })
    }

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
    sendCommand({ command: 'LOADING_END', forEditing })
  } catch (err) {
    console.error(err)
    sendCommand({
      command: 'LOAD_MAP_ERROR', 
      error: err.message || 'unknown error'
    })
  }
}

exports.DELETE_SAVE_FILE = async ({ data }) => {
  try {
    const fullPath = getSaveFilesDirPath() + data + '.sav'
    await fs.promises.rm(fullPath)

    await UPDATE_SAVES_INFO({ key: data })
  } catch (err) {
    dialog.showErrorBox('Can\'t delete', err.message)
  }
}

const UPDATE_SAVES_INFO = async ({ key, data }) => {
  try {
    const fullPath = getSaveFilesDirPath() + 'saves.inf'
    let savesDB = {}
    
    try {
      const fileText = await fs.promises.readFile(fullPath, { encoding: 'utf8' })
      savesDB = JSON.parse(fileText)
    } catch (err) {
      console.warn('Saves DB error:', err.message)
    }
    
    if(!data){
      delete savesDB[key]
    } else {
      savesDB[key] = data
    }

    const json = JSON.stringify(savesDB)
    await fs.promises.writeFile(
      fullPath, 
      json
    )
    sendCommand({
      command: 'TO_GAME',
      data: { method: 'saves_list', data: json }
    })
  } catch (err) {
    dialog.showErrorBox('Save game error:', err.message)
  }
}
exports.UPDATE_SAVES_INFO = UPDATE_SAVES_INFO

exports.SAVE_GAME = async ({ data }) => {
  try {
    const { path, text } =  data
    const fullPath = getSaveFilesDirPath() + path
    
    const compressed = await compress(text)
    await fs.promises.writeFile(fullPath, compressed)
  } catch (err) {
    dialog.showErrorBox('Save game error:', err.message)
  }
}

exports.LOAD_GAME = async ({ data }) => {
  try {
    const saveFilePath = getSaveFilesDirPath() + data
    const fileBuffer = await fs.promises.readFile(saveFilePath)
    const decompressed = await decompress(fileBuffer)
    
    sendCommand({
      command: 'TO_GAME', 
      data: { 
        method: 'save_file_loaded',
        data: decompressed
      }
    })
  } catch (err) {
    dialog.showErrorBox('Load game error:', err.message)
  }
}

exports.LOAD_SAVES_LIST = async () => {
  try {
    const saveFilePath = getSaveFilesDirPath() + "saves.inf"
    const fileText = await fs.promises.readFile(saveFilePath, { encoding: 'utf8' })

    sendCommand({
      command: 'TO_GAME',
      data: { method: 'saves_list', data: fileText }
    })
  } catch (err) {
    sendCommand({
      command: 'TO_GAME',
      data: { method: 'saves_list', data: '{}' }
    })
  }
}

exports.LOAD_MAPS_LIST = async () => {
  let dirs = []
  const mapsDirPath = getMapsDirPath()
  try {  
    dirs = await fs.promises.readdir(mapsDirPath)
  } catch (err) {
    dialog.showErrorBox('Maps directory error:', err.message)
  }
  
  const maps = []
  while( dirs.length > 0 ){
    const dir = mapsDirPath + dirs.pop()
    try {
      const fileText = await fs.promises.readFile(dir + '/info.json', { encoding: 'utf8' })
      maps.push(fileText)
    } catch (err) {
      console.error(err)
    }
  }
  sendCommand({ 
    command: 'TO_GAME', 
    data: { method: 'maps_list', data: maps }
  })
}

exports.EXIT = () => app.quit()

exports.OPEN_MAP = async ({ data }) => {
  const mapsDirPath = getMapsDirPath()
  await loadMap(mapsDirPath + data)
}

exports.EDIT_MAP = async () => {
  const { mainWindow } = require('./main')
  const dir = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory']
  })
  if (!dir) { return }
  
  await loadMap(dir[0], true)
}

exports.SAVE_TEXT_FILE = async ({ data }) => {
  const { path, text } =  data
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

exports.MAKE_DIR = async ({ path }) => {
  try {
    const fullPath = (mapDirectory + '\\' + path).replaceAll('/', '\\')
    
    await fs.promises.mkdir(fullPath)
  } catch (err) {
    dialog.showErrorBox('Folder creation error', err.message)
  }
}

exports.DELETE = async ({ path }) => {
  try {
    const fullPath = (mapDirectory + '\\' + path).replaceAll('/', '\\')
    
    await shell.trashItem(fullPath)
    sendCommand({ command: 'DELETED', path })
  } catch (err) {
    dialog.showErrorBox('Can\'t delete', err.message)
  }
}

exports.RENAME = async ({ path, newName }) => {
  try {
    if (!newName) return
    const oldPath = (mapDirectory + '\\' + path).replaceAll('/', '\\')

    const parts = path.split('\\')
    parts.pop()
    parts.push(newName)
    const newPath = (mapDirectory + '\\' + parts.join('\\')).replaceAll('/', '\\')
    
    await fs.promises.rename(oldPath, newPath)
    sendCommand({ command: 'RENAMED', path, newName })
  } catch (err) {
    dialog.showErrorBox('Can\'t rename', err.message)
  }
}

exports.CREATE_MAP = async () => {
  const { mainWindow } = require('./main')
  const dir = dialog.showSaveDialogSync(mainWindow, {
    title: 'Create Map',
    properties: ['createDirectory']
  })
  if (!dir) { return }

  const mapId = dir.split(/[\\/]/gm).pop()
  
  try {
    await fs.promises.mkdir(dir)
    await makeRootFiles(dir, mapId)

    await makeFieldsDir(dir, mapId)
    await makeImagesDir(dir, mapId)
    await makeLocaleDir(dir, mapId)
    await makeParticlesDir(dir, mapId)
    await makeScriptsDir(dir, mapId)
    await makeUnitsDir(dir, mapId)
    await makeItemsDir(dir, mapId)
    
    await loadMap(dir, true)
  } catch (err) {
    dialog.showErrorBox('Create directory error', err.message)
  }
}

const makeRootFiles = async (dir, mapId) => {
  await fs.promises.writeFile(
    dir + '\\buffs.json',
    JSON.stringify({})
  )
  await fs.promises.writeFile(
    dir + '\\units.json',
    JSON.stringify({})
  )
  await fs.promises.writeFile(
    dir + '\\items.json',
    JSON.stringify({})
  )
  await fs.promises.writeFile(
    dir + '\\skills.json',
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
      name: mapId,
      author: 'unknown',
      version: 0.01,
      startField: 'main.json',
      singlePlayer: false,
      maxPlayers: 6,
      countryColors: [
        '0xff4444','0x44ff44','0x4444ff','0x44ffff','0xff44ff','0xffff44'
      ]
    }, null, 2)
  )
}

const makeLocaleDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\locales')
  await fs.promises.writeFile(
    dir + '\\locales\\en.json',
    JSON.stringify({ mapName: mapId }, null, 2)
  )
}

const makeParticlesDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\particles')
}

const makeScriptsDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\scripts')
  await fs.promises.writeFile(
    dir + '\\scripts\\help.hx',
    testScriptText
  )
}

const makeItemsDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\items')
}

const makeUnitsDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\units')
}

const makeImagesDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\img')
}

const makeFieldsDir = async (dir, mapId) => {
  const mapSize = 19

  await fs.promises.mkdir(dir + '\\fields')
  await fs.promises.writeFile(
    dir + '\\fields\\main.json',
    JSON.stringify({
      id: 'main.json',
      size: mapSize,
      tiles: Array(mapSize * mapSize).fill([1, 0]),
      units: {},
      items: {},
    }, null, 2)
  )
}

const testScriptText = `
//This is a script file. The script language is Haxe.
//Assign it to a skill or buff in the map editor and 
//it will be executed when a unit uses the skill or is affected by the buff effect.
//There are global variables and functions.
//Use trace function to write any information in the console. Like this:
trace("Hello World!");

//There are also global utility classes: Math and HexMath.
//See how other scripts use them.

//All game variables are stored in vars global object. 
//All game functions are stored in funcs global object.
//Look what's inside:
trace(vars);
trace(funcs);

//Sometimes the game waits for a script to return a value.
//For example, if you return false, it will be considered a failure and any changes made by the script will be reverted.
return false;
  `
