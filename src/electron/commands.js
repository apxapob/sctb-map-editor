const { dialog, shell, app } = require('electron')
const fs = require('fs')
const { sendCommand } = require('./messenger')
const { compress, decompress, isTextFile } = require('./StringUtils')
const { loadMapDir, loadMapFile, saveMapFile, removeMapFile, renameMapFile, loadMapInfo, makeMapFile } = require('./loadFuncs')

let curMapPath = null
const isMapFileMode = () => curMapPath?.endsWith(".map")

const getSharedImagesDirPath = () => {
  return app.isPackaged ? './res/img/' : '../sctb-client/res/img/'
}

const getMapsDirPath = () => {
  return app.isPackaged ? './maps/' : '../sctb-client/maps/'
}
const getSaveFilesDirPath = () => {
  return app.isPackaged ? './saves/' : '../sctb-client/saves/'
}

const loadMap = async (mapPath, editMode = false) => {
  try {
    curMapPath = mapPath = mapPath.replaceAll("\\", "/")
    const mapId = mapPath.substring(
      mapPath.lastIndexOf("/")+1,
      mapPath.endsWith(".map") ? mapPath.length-4 : undefined
    )
    sendCommand({ command: 'LOADING_START' })
    
    let files = []
    const dirs = []

    const sharedImgPath = getSharedImagesDirPath()
    await loadMapDir(sharedImgPath, dirs, files, s => s.replace(sharedImgPath, 'img'))
    
    if(isMapFileMode()){
      await loadMapFile(mapPath, dirs, files)
    } else {
      await loadMapDir(mapPath, dirs, files, s => s.replace(mapPath + '/', ''))
    }

    files = files.reverse().filter((f, idx) => {
      const dupIdx = files.findIndex(f2 => f2.path === f.path)
      return idx <= dupIdx
    })

    for (const dir of dirs) {
      sendCommand({ command: 'LOAD_DIRECTORY', path: dir, editMode })
    }

    let loaded = 0
    for (const fileEntry of files) {
      const { content, path } = fileEntry
      if (isTextFile(path)) {
        sendCommand({
          command: 'LOAD_TEXT_FILE', 
          text: content.toString(),
          progress: loaded / files.length, 
          file: path,
          editMode
        })
        loaded++
      } else {
        sendCommand({ 
          command: 'LOAD_BINARY_FILE', 
          bytes: content, 
          progress: loaded / files.length, 
          file: path,
          editMode
        })
        loaded++
      }
    }
    sendCommand({ command: 'LOADING_END', editMode, mapId })
  } catch (err) {
    curMapPath = null
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
  let files = []
  const mapsDirPath = getMapsDirPath()
  try {
    files = await fs.promises.readdir(mapsDirPath)
  } catch (err) {
    dialog.showErrorBox('Maps directory error:', err.message)
  }
  
  sendCommand({
    command: 'TO_GAME',
    data: { 
      method: 'maps_list', 
      data: files.filter(f => f.endsWith(".map")).map(f => f.substring(0, f.length-4))
    }
  })
}

exports.LOAD_MAP_INFO = async ({ mapId }) => {
  try {
    const mapFilePath = getMapsDirPath() + mapId + ".map"
    const info = await loadMapInfo(mapFilePath)
    sendCommand({
      command: 'TO_GAME',
      data: { method: 'map_info', mapId, info }
    })
  } catch (err) {
    console.error('Map file error:', err.message)
  }
}

exports.EXIT = () => app.quit()

exports.OPEN_MAP = async ({ data }) => {
  const mapsDirPath = getMapsDirPath()
  await loadMap(mapsDirPath + data + ".map")
}

exports.EDIT_MAP_FOLDER = async () => {
  const { mainWindow } = require('./main')
  const dirs = dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] })
  if (!dirs) { return }
  
  await loadMap(dirs[0], true)
}

exports.EDIT_MAP = async () => {
  const { mainWindow } = require('./main')
  const files = dialog.showOpenDialogSync(mainWindow, {
    filters: [
      { name: 'Map files', extensions: ['map'] }
    ]
  })
  if (!files) { return }
  
  await loadMap(files[0], true)
}

exports.SAVE_TEXT_FILE = async ({ data }) => {
  const { path, text } =  data
  if (!curMapPath) {
    console.error('no open map')
    return
  }
  try {
    if(isMapFileMode()){
      saveMapFile(curMapPath, path, text)
    } else {
      const fullPath = (curMapPath + '\\' + path).replaceAll('/', '\\')
      await fs.promises.writeFile(fullPath, text)
    }
  } catch (err) {
    dialog.showErrorBox('Map save error', err.message)
  }
}

exports.MAKE_DIR = async ({ path }) => {
  try {
    if(isMapFileMode()){
      return
    } else {
      const fullPath = (curMapPath + '\\' + path).replaceAll('/', '\\')
      await fs.promises.mkdir(fullPath)
    }
  } catch (err) {
    dialog.showErrorBox('Folder creation error', err.message)
  }
}

exports.DELETE = async ({ path, dirFiles }) => {
  try {
    if(isMapFileMode()){
      removeMapFile(curMapPath, path, dirFiles)
    } else {
      const fullPath = (curMapPath + '\\' + path).replaceAll('/', '\\')
      await shell.trashItem(fullPath)
    }

    sendCommand({ command: 'DELETED', path })
  } catch (err) {
    dialog.showErrorBox('Can\'t delete', err.message)
  }
}

exports.RENAME = async ({ path, newName }) => {
  try {
    if (!newName) return

    const parts = path.split('/')
    parts.pop()
    parts.push(newName)

    if(isMapFileMode()){
      renameMapFile(curMapPath, path, parts.join('/'))
    } else {
      const oldPath = (curMapPath + '/' + path).replaceAll('/', '\\')
      const newPath = (curMapPath + '/' + parts.join('/')).replaceAll('/', '\\')
      
      await fs.promises.rename(oldPath, newPath)
    }
    
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
    await makeMapFile(dir, dir + ".map")

    await fs.promises.rm(dir, { recursive: true, force: true })
    await loadMap(dir + ".map", true)
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
      countries: [
        {
          color: 16729156,
          minerals: 100,
          mana: 10
        },
        {
          color: 4474111,
          minerals: 100,
          mana: 10
        },
        {
          color: 4521796,
          minerals: 100,
          mana: 10
        },
        {
          color: 4521983,
          minerals: 100,
          mana: 10
        },
        {
          color: 16729343,
          minerals: 100,
          mana: 10
        },
        {
          color: 16777028,
          minerals: 100,
          mana: 10
        }
      ],
      tiles: [
        {
          image_h: "hex_h.png",
          image_v: "hex_v.png",
          color: 16777215
        },
        {
          image_h: "hex_h.png",
          image_v: "hex_v.png",
          color: 0
        }
      ],
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

const makeImagesDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\img')
  await fs.promises.mkdir(dir + '\\img\\units')
  await fs.promises.mkdir(dir + '\\img\\items')
  await fs.promises.mkdir(dir + '\\img\\tiles')
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
trace(HexMath);
trace(Math);

//Sometimes the game waits for a script to return a value.
//For example, if you return false, it will be considered a failure and any changes made by the script will be reverted.
return false;
  `
