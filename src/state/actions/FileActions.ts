import { action, toJS } from 'mobx'
import { FSCommandType, LoadBinaryCommandType, LoadTextCommandType, RenameType } from '../../types/commands'
import { MapInfo } from '../../types/types'
import { FIELDS_PATH, FilesTree, INFO_PATH, MapFiles, PathTreeType, getDirPath } from '../MapFiles'
import SendToGame from './SendToGame'
import { EditorState } from '../ToolState'
import { CreateFolder } from './SaveChanges'

export const OnLoadingStart = action(() => {
  MapFiles.text = {}
  MapFiles.binary = {}
  MapFiles.status = 'Loading'
  MapFiles.error = null

  FilesTree.nodes = {}

  SendToGame({ method: 'loading_start' })
})

export const OnLoadingEnd = action((mapId:string, isPlayMode:boolean) => {
  try {
    MapFiles.status = 'Loaded'
    const mapInfo = MapFiles.json[INFO_PATH] as MapInfo
    if (mapInfo && mapInfo.mapId) {
      MapFiles.selectedField = FIELDS_PATH + mapInfo.startField
    }
    
    SendToGame({ 
      method: 'show_map', 
      data: { mapId, isPlayMode }
    })
    
    EditorState.mode = isPlayMode ? 'play' : 'edit'
  } catch (e:unknown) {
    OnLoadingError('Invalid info.json file: ' + (e as Error).message)
  }
})

export const OnLoadingError = action((errorText:string) => {
  MapFiles.status = 'Error'
  MapFiles.error = errorText
  console.error(errorText)
})

const removeFromTree = action((file:string) => {
  const parts = file.split('/')
  let curPart = ''
  let curTree:PathTreeType = FilesTree
  for (let i = 0; i < parts.length; i++) {
    curPart = parts[i]
    if (i === parts.length - 1) {
      delete curTree.nodes[curPart]
      break
    }
    if (!(curPart in curTree.nodes)) {
      break
    }
    curTree = curTree.nodes[curPart]
  }
})

const addToTree = action((file:string, isDirectory = false, isGameFile = false) => {
  const parts = file.split('/')
  let curPart = ''
  let curTree:PathTreeType = FilesTree
  for (let i = 0; i < parts.length; i++) {
    curPart = parts[i]
    if (!(curPart in curTree.nodes)) {
      curTree.nodes[curPart] = {
        isOpen: false,
        isDirectory: i < parts.length - 1 || isDirectory,
        isGameFile,
        nodes: {}, 
        path: curTree.path === '' ? curPart : curTree.path + '/' + curPart
      }
    }
    curTree = curTree.nodes[curPart]
  }
})

export const processTextFile = action((file:string, text:string, gameFile: boolean) => {
  MapFiles.text[file] = text

  if (file.endsWith('.json')) {
    try {
      MapFiles.json[file] = JSON.parse(text)
    } catch (e) {
      console.error('Can\'t parse', file, (e as Error).message, text)
    }
  }
  
  addToTree(file, false, gameFile)
})

export const OnLoadedDirectory = action((c:FSCommandType) => {
  if(c.editMode !== true){ return }
  if(c.path.endsWith("\\") || c.path.endsWith("/")){
    c.path = c.path.substring(0, c.path.length-1)
  }
  
  addToTree(c.path, true, c.gameFile)
})

export const OnDeleted = action((c:FSCommandType) => {
  removeFromTree(c.path)
  delete MapFiles.binary[c.path]
  delete MapFiles.text[c.path]
  delete MapFiles.json[c.path]

  if (
    c.path === getDirPath(EditorState.activeTab).replace('/', '')
  ) {
    //deleted one of the main folders in map, let's restore it
    CreateFolder(c.path)
  }
})

export const OnRenamed = action((c:RenameType) => {
  const oldPath = c.path
  const pathParts = c.path.split('/')
  pathParts.pop()
  pathParts.push(c.newName)
  const newPath = pathParts.join('/')
  if (MapFiles.binary[oldPath]) {
    MapFiles.binary[newPath] = MapFiles.binary[oldPath]
    delete MapFiles.binary[oldPath]
  }
  if (MapFiles.text[oldPath]) {
    MapFiles.text[newPath] = MapFiles.text[oldPath]
    delete MapFiles.text[oldPath]
  }
  if (MapFiles.json[oldPath]) {
    MapFiles.json[newPath] = MapFiles.json[oldPath]
    delete MapFiles.json[oldPath]
  }

  const parts = oldPath.split('/')
  let curPart = ''
  let curTree:PathTreeType = FilesTree
  for (let i = 0; i < parts.length; i++) {
    curPart = parts[i]
    if (i === parts.length - 1) {
      curTree.nodes[c.newName] = curTree.nodes[curPart]
      curTree.nodes[c.newName].path = newPath
      delete curTree.nodes[curPart]
      break
    }
    if (!(curPart in curTree.nodes)) {
      break
    }
    curTree = curTree.nodes[curPart]
  }
})

export const OnLoadedText = action((c:LoadTextCommandType, refreshGame = false) => {
  if(c.editMode){
    processTextFile(c.file, c.text, c.gameFile)
  }
  
  SendToGame({
    method: 'load_text_file',
    data: {
      path: c.file,
      text: c.text,
      progress: c.progress,
      refresh: refreshGame
    }
  })
})

export const OnLoadedBinary = action((c:LoadBinaryCommandType) => {
  if(c.editMode){
    MapFiles.binary[c.file] = c.bytes
    addToTree(c.file, false, c.gameFile)
  }
  SendToGame({
    method: 'load_binary_file', 
    data: {
      path: c.file,
      bytes: c.bytes,
      progress: c.progress
    }
  })
})
