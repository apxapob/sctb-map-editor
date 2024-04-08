const { dialog, shell, app } = require('electron')
const fs = require('fs')
const { sendCommand } = require('./messenger')
const { compress, decompress, isTextFile } = require('./StringUtils')
const { loadMapDir } = require('./loadFuncs')
const { makeNewMap } = require('./makeNewMap')
const { 
  GetPlayerName, GetPlayerId, CloudEnabled, deleteFile, readFile, writeFile, fileExists, 
  createLobby, getLobbies, joinLobby, leaveLobby, sendMessage, getUsersData, gameStarted,
  openInviteDialog
} = require('./steamApi')
const { SteamEnabled } = require('./consts')

let curMapPath = null

const getSharedImagesDirPath = () => {
  return app.isPackaged ? './res/img/' : '../sctb-client/res/img/'
}

const getMapsDirPath = () => {
  return app.isPackaged ? './maps/' : '../sctb-client/maps/'
}
const getSaveFilesDirPath = () => {
  if(CloudEnabled())return ""
  
  return app.isPackaged ? './saves/' : '../sctb-client/saves/'
}

const loadMap = async (mapPath, mode, requestId) => {
  try {
    curMapPath = mapPath = mapPath.replaceAll("\\", "/")
    const mapId = mapPath.substring(mapPath.lastIndexOf("/")+1)
    sendCommand({ command: 'LOADING_START' })
    
    let files = []
    const dirs = []

    const sharedImgPath = getSharedImagesDirPath()
    await loadMapDir(sharedImgPath, dirs, files, s => s.replace(sharedImgPath, 'img'), true)
    await loadMapDir(mapPath, dirs, files, s => s.replace(mapPath + '/', ''), false)
    
    files = files.reverse().filter((f, idx) => {
      const dupIdx = files.findIndex(f2 => f2.path === f.path)
      return idx <= dupIdx
    })

    for (const dir of dirs) {
      sendCommand({ command: 'LOAD_DIRECTORY', path: dir.path, mode, gameFile: dir.gameFile })
    }

    let loaded = 0
    for (const fileEntry of files) {
      const { content, path, gameFile } = fileEntry
      if (isTextFile(path)) {
        sendCommand({
          command: 'LOAD_TEXT_FILE', 
          text: content.toString(),
          progress: loaded / files.length, 
          file: path,
          gameFile,
          mode
        })
        loaded++
      } else {
        sendCommand({ 
          command: 'LOAD_BINARY_FILE', 
          bytes: content, 
          progress: loaded / files.length, 
          file: path,
          gameFile,
          mode
        })
        loaded++
      }
    }
    sendCommand({ command: 'LOADING_END', mode, mapId, requestId })
  } catch (err) {
    curMapPath = null
    console.error(err)
    sendCommand({
      command: 'LOAD_MAP_ERROR', 
      error: err.message || 'unknown error',
      requestId
    })
  }
}

exports.DELETE_SAVE_FILE = async ({ data, requestId }) => {
  try {
    const fullPath = getSaveFilesDirPath() + data + '.sav'
    await deleteFile(fullPath)
    await UPDATE_SAVES_INFO({ key: data, requestId })
  } catch (err) {
    dialog.showErrorBox('Can\'t delete', err.message)
  }
}

const UPDATE_SAVES_INFO = async ({ key, data, requestId }) => {
  try {
    const fullPath = getSaveFilesDirPath() + 'saves.inf'
    let savesDB = {}
    
    try {
      const fileText = await readFile(fullPath)
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
    await writeFile(fullPath, json)
    sendCommand({
      command: 'TO_GAME',
      data: { method: 'saves_list', data: json, requestId }
    })
  } catch (err) {
    console.error(err)
    dialog.showErrorBox('Save game error:', err.message)
  }
}
exports.UPDATE_SAVES_INFO = UPDATE_SAVES_INFO

exports.SAVE_GAME = async ({ data }) => {
  try {
    const { path, text } =  data
    const fullPath = getSaveFilesDirPath() + path
    
    const compressed = await compress(text)
    await writeFile(fullPath, compressed)
  } catch (err) {
    console.error(err)
    dialog.showErrorBox('Save game error:', err.message)
  }
}

exports.LOAD_MULTIPLAYER_PROFILE = async ({ requestId }) => {
  let decompressed = null
  if(!SteamEnabled){
    try {
      const profilePath = getSaveFilesDirPath() + 'data.prf'
      const fileContent = await readFile(profilePath)
      if(!!fileContent)decompressed = await decompress(fileContent)
    } catch (err) {
      console.warn('Load profile error:', err.message)
    }
  }
  
  if(decompressed === null){
    decompressed = JSON.stringify({ name: GetPlayerName(), id: GetPlayerId(), password: null })
  }
  
  sendCommand({
    command: 'TO_GAME', 
    data: { 
      method: 'profile_loaded',
      profile: decompressed,
      requestId
    }
  })
}

exports.CREATE_LOBBY = async ({ requestId }) => {
  const lobby = await createLobby()
  sendCommand({
    command: 'TO_GAME', 
    data: { 
      method: 'lobby_created',
      lobby,
      requestId
    }
  })
}

exports.JOIN_LOBBY = async ({ lobbyId, requestId }) => {
  const lobby = await joinLobby(lobbyId)
  sendCommand({
    command: 'TO_GAME', 
    data: { 
      method: 'lobby_joined',
      lobby,
      requestId
    }
  })
}

exports.GET_LOBBIES = async ({ requestId }) => {
  const lobbies = await getLobbies()
  sendCommand({
    command: 'TO_GAME', 
    data: { 
      method: 'lobbies_list',
      lobbies,
      requestId
    }
  })
}

exports.LEAVE_LOBBY = () => {
  leaveLobby()
}

exports.GAME_STARTED = () => {
  gameStarted()
}

exports.OPEN_INVITE_DIALOG = () => {
  openInviteDialog()
}

exports.SEND_MSG_TO = async ({ userId, data }) => {
  await sendMessage(userId, data)
}

exports.GET_USERS_DATA = async ({ users, requestId }) => {
  sendCommand({
    command: 'TO_GAME', 
    data: { 
      method: 'users_loaded',
      players: await getUsersData(users),
      requestId
    }
  })
}

exports.LOAD_GAME = async ({ data, replay, requestId }) => {
  try {
    const saveFilePath = getSaveFilesDirPath() + data
    const fileContent = await readFile(saveFilePath)
    const decompressed = await decompress(fileContent)

    sendCommand({
      command: 'TO_GAME', 
      data: { 
        method: 'save_file_loaded',
        data: decompressed,
        replay,
        requestId
      }
    })
  } catch (err) {
    dialog.showErrorBox('Load game error:', err.message)
  }
}

exports.LOAD_SAVES_LIST = async ({ requestId }) => {
  try {
    const saveFilePath = getSaveFilesDirPath() + "saves.inf"
    const fileText = await readFile(saveFilePath)
    sendCommand({
      command: 'TO_GAME',
      data: { method: 'saves_list', data: fileText, requestId }
    })
  } catch (err) {
    sendCommand({
      command: 'TO_GAME',
      data: { method: 'saves_list', data: '{}', requestId }
    })
  }
}

exports.LOAD_MAPS_LIST = async ({ requestId }) => {
  let mapDirs = []
  const mapsDirPath = getMapsDirPath()
  try {
    mapDirs = await fs.promises.readdir(mapsDirPath)
    mapDirs = mapDirs.filter(f => fs.lstatSync(mapsDirPath+f).isDirectory())
  } catch (err) {
    dialog.showErrorBox('Maps directory error:', err.message)
  }
  
  sendCommand({
    command: 'TO_GAME',
    data: { 
      method: 'maps_list', 
      data: mapDirs,
      requestId
    }
  })
}

exports.LOAD_MAP_INFO = async ({ mapId, requestId }) => {
  try {
    const mapInfoPath = getMapsDirPath() + mapId + "/" + "info.json"
    const info = await fs.promises.readFile(mapInfoPath, { encoding: 'utf8' })
    
    sendCommand({
      command: 'TO_GAME',
      data: { method: 'map_info', mapId, info, requestId }
    })
  } catch (err) {
    console.error('Map file error:', err.message)
    sendCommand({
      command: 'TO_GAME',
      data: { method: 'map_info', mapId, info: null, error: err.message, requestId }
    })
  }
}

exports.EXIT = () => app.quit()

exports.OPEN_MAP = async ({ mapId, replay, requestId }) => {
  const mapsDirPath = getMapsDirPath() + mapId
  await loadMap(mapsDirPath, replay ? "replay" : "play", requestId)
}

exports.MAP_TRANSFER = async ({ mapId, toPlayerId, requestId }) => {
  const mapPath = getMapsDirPath() + mapId

  const dirs = []
  const files = []
  await loadMapDir(mapPath, dirs, files, s => s.replace(mapPath + '/', ''), false)

  for (const dir of dirs) {
    sendCommand({
      command: 'TO_GAME',
      data: { method: 'transfer_dir', path: dir.path, toPlayerId, mapId }
    })
  }

  let loaded = 0
  for (const fileEntry of files) {
    const { content, path, gameFile } = fileEntry
    if (isTextFile(path)) {
      sendCommand({
        command: 'TO_GAME',
        data: { 
          method: 'transfer_text_file', 
          path,
          toPlayerId, 
          mapId,
          text: content.toString(),
          progress: loaded / files.length 
        }
      })
      loaded++
    } else {
      sendCommand({
        command: 'TO_GAME',
        data: { 
          method: 'transfer_binary_file', 
          path, 
          toPlayerId, 
          mapId,
          bytes: content, 
          progress: loaded / files.length
        }
      })
      loaded++
    }
  }
  sendCommand({
    command: 'TO_GAME',
    data: { 
      method: 'transfer_end', 
      mapId, 
      toPlayerId,
      requestId 
    }
  })
}

exports.EDIT_MAP = async ({ requestId }) => {
  const { mainWindow } = require('./main')
  const dirs = dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] })
  if (!dirs) { return }
  
  await loadMap(dirs[0], "edit", requestId)
}

exports.SAVE_TEXT_FILE = async ({ data }) => {
  const { path, text } =  data
  if (!curMapPath) {
    console.error('no open map')
    return
  }
  try {
    const fullPath = (curMapPath + '\\' + path).replaceAll('/', '\\')
    await fs.promises.writeFile(fullPath, text)
  } catch (err) {
    dialog.showErrorBox('Map save error', err.message)
  }
}

exports.SHOW_MESSAGE = async ({ title, message }) => {
  dialog.showMessageBox({
    type: 'warning',
    title: title || 'Message',
    message
  })
}

exports.MAKE_DIR = async ({ path }) => {
  try {
    const fullPath = (curMapPath + '\\' + path).replaceAll('/', '\\')
    await fs.promises.mkdir(fullPath)
  } catch (err) {
    dialog.showErrorBox('Folder creation error', err.message)
  }
}

exports.DELETE = async ({ path, dirFiles }) => {
  try {
    const fullPath = (curMapPath + '\\' + path).replaceAll('/', '\\')
    await shell.trashItem(fullPath)
    
    sendCommand({ command: 'DELETED', path })
    if(!path.startsWith("img/")){ return }

    const sharedImgPath = getSharedImagesDirPath() + path.substring(4)
    if(fs.existsSync( sharedImgPath )){
      if( fs.lstatSync(sharedImgPath).isDirectory() ){
        fs.promises.mkdir(curMapPath + '\\' + path)
        sendCommand({ command: 'LOAD_DIRECTORY', path, mode: "edit" })

        const dirs = []
        const files = []
        await loadMapDir(sharedImgPath, dirs, files, s => s.replace(sharedImgPath, path))
        for (const dir of dirs) {
          sendCommand({ command: 'LOAD_DIRECTORY', path: dir, mode: "edit" })
        }
        for (const fileEntry of files) {
          const { content, path } = fileEntry
          sendCommand({ 
            command: 'LOAD_BINARY_FILE', 
            bytes: content, 
            progress: 1,
            file: path,
            gameFile: true,
            mode: "edit"
          })
        }
        
        return
      }

      const bytes = await fs.promises.readFile(sharedImgPath)
      sendCommand({
        command: 'LOAD_BINARY_FILE', 
        bytes,
        progress: 1,
        file: path,
        gameFile: true,
        mode: "edit"
      })
    }
  } catch (err) {
    const sharedImgPath = getSharedImagesDirPath() + path.substring(4)
    if(fs.existsSync( sharedImgPath )){
      dialog.showErrorBox('Can\'t delete ' + path, "This file is from the game, not from the map.")
      return
    }
    dialog.showErrorBox('Can\'t delete ' + path, err.message)
  }
}

exports.RENAME = async ({ path, newName }) => {
  try {
    if (!newName) return

    const parts = path.split('/')
    parts.pop()
    parts.push(newName)

    const oldPath = (curMapPath + '/' + path).replaceAll('/', '\\')
    const newPath = (curMapPath + '/' + parts.join('/')).replaceAll('/', '\\')
    
    await fs.promises.rename(oldPath, newPath)
    
    sendCommand({ command: 'RENAMED', path, newName })
  } catch (err) {
    dialog.showErrorBox('Can\'t rename', err.message)
  }
}

exports.ADD_FILE = async ({ path }) => {
  const { mainWindow } = require('./main')
  const files = dialog.showOpenDialogSync(mainWindow, {
    properties: ['multiSelections'],
    filters: [
      { name: 'Map files', extensions: ['json','hx','txt','png'] }
    ]
  })
  if (!files) { return }

  for (const filePath of files){
    const fileName = filePath.replaceAll("\\", "/").split("/").pop()
    
    const isText = isTextFile(filePath)
    const bytes = isText ? undefined : await fs.promises.readFile(filePath)
    const text = isText ? await fs.promises.readFile(filePath, { encoding: 'utf8' }) : undefined
    sendCommand({
      command: isText ? 'LOAD_TEXT_FILE' : 'LOAD_BINARY_FILE',
      text,
      bytes,
      progress: 1,
      gameFile: false,
      file: path + "/" + fileName,
      mode: "edit"
    })

    fs.promises.copyFile(filePath, curMapPath + "/" + path + "/" + fileName)
  }
  
}

exports.CREATE_MAP = async ({ requestId }) => {
  const { mainWindow } = require('./main')
  const dir = dialog.showSaveDialogSync(mainWindow, {
    title: 'Create Map',
    properties: ['createDirectory']
  })
  if (!dir) { return }
  
  try {
    await fs.promises.mkdir(dir)
    await makeNewMap(dir)
    await loadMap(
      dir,
      "edit",
      requestId
    )
  } catch (err) {
    dialog.showErrorBox('Create directory error', err.message)
  }
}
