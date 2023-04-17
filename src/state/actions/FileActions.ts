import { action } from 'mobx'
import { FSCommandType, LoadBinaryCommandType, LoadTextCommandType, RenameType } from '../../types/commands'
import { MapInfo } from '../../types/types'
import { FilesTree, INFO_PATH, MapFiles, PathTreeType, getDirPath } from '../MapFiles'
import OpenPanel, { ClosePanel } from './OpenPanel'
import SendMsgToGame from './SendMsgToGame'
import { EditorState } from '../ToolState'
import { CreateFolder } from './SaveChanges'

export const OnLoadingStart = action(() => {
  MapFiles.progress = 0
  MapFiles.text = {}
  MapFiles.binary = {}
  MapFiles.lastLoadedFile = ''
  MapFiles.status = 'Loading'
  MapFiles.error = null

  FilesTree.nodes = {}

  OpenPanel('LoadingMap')
})

export const OnLoadingEnd = action(() => {
  MapFiles.progress = 1
  try {
    if (MapFiles.text[INFO_PATH] !== undefined) {
      MapFiles.status = 'Loaded'
      const mapInfo = MapFiles.json[INFO_PATH] as MapInfo
      if (mapInfo && mapInfo.mapId) {
        ClosePanel()
        SendMsgToGame({ method: 'show_map_editor', data: mapInfo.mapId })
      } else {
        OnLoadingError('Invalid info.json file: no mapId')
      }
    } else {
      OnLoadingError('Can\'t find info.json file')
    }
  } catch (e:unknown) {
    OnLoadingError('Invalid info.json file: ' + (e as Error).message)
  }
})

export const OnLoadingError = action((errorText:string) => {
  MapFiles.status = 'Error'
  MapFiles.error = errorText
})

const removeFromTree = action((file:string) => {
  const parts = file.split('\\')
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

const addToTree = action((file:string, isDirectory = false) => {
  const parts = file.split('\\')
  let curPart = ''
  let curTree:PathTreeType = FilesTree
  for (let i = 0; i < parts.length; i++) {
    curPart = parts[i]
    if (!(curPart in curTree.nodes)) {
      curTree.nodes[curPart] = {
        isOpen: true,
        isDirectory: i < parts.length - 1 || isDirectory,
        nodes: {}, 
        path: curTree.path === '' ? curPart : curTree.path + '\\' + curPart
      }
    }
    curTree = curTree.nodes[curPart]
  }
})

export const processTextFile = action((file:string, text:string) => {
  MapFiles.text[file] = text

  if (file.endsWith('.json')) {
    try {
      MapFiles.json[file] = JSON.parse(text)
    } catch (e) {
      console.error('Can\'t parse', file, (e as Error).message)
    }
  }
  
  addToTree(file)
})

export const OnLoadedDirectory = action((c:FSCommandType) => {
  addToTree(c.path, true)
})

export const OnDeleted = action((c:FSCommandType) => {
  removeFromTree(c.path)
  delete MapFiles.binary[c.path]
  delete MapFiles.text[c.path]
  delete MapFiles.json[c.path]

  if (
    c.path === getDirPath(EditorState.activeTab).replace('\\', '')
  ) {
    //deleted one of the main folders in map, let's restore it
    CreateFolder(c.path)
  }
})

export const OnRenamed = action((c:RenameType) => {
  const oldPath = c.path
  const pathParts = c.path.split('\\')
  pathParts.pop()
  pathParts.push(c.newName)
  const newPath = pathParts.join('\\')
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

  const parts = oldPath.split('\\')
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
  MapFiles.progress = c.progress
  MapFiles.lastLoadedFile = c.file
  processTextFile(c.file, c.text)

  SendMsgToGame({
    method: 'load_text_file', 
    data: {
      path: c.file,
      text: c.text,
      refresh: refreshGame
    }
  })
})

export const OnLoadedBinary = action((c:LoadBinaryCommandType) => {
  MapFiles.binary[c.file] = c.bytes.length
  MapFiles.progress = c.progress
  MapFiles.lastLoadedFile = c.file

  addToTree(c.file)

  SendMsgToGame({
    method: 'load_binary_file', 
    data: {
      path: c.file,
      bytes: c.bytes
    }
  })
})
