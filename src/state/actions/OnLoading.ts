import { action } from 'mobx'
import { FSCommandType, LoadBinaryCommandType, LoadTextCommandType } from '../../types/commands'
import { MapInfo } from '../../types/types'
import { FilesTree, INFO_PATH, MapFiles, PathTreeType, TEXTS_PATH } from '../MapFiles'
import { SelectLangFile, SelectScriptFile } from './OpenFileTree'
import OpenPanel, { ClosePanel } from './OpenPanel'
import SendMsgToGame from './SendMsgToGame'

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
    MapFiles.json[file] = JSON.parse(text)
    if (file.startsWith(TEXTS_PATH) && !MapFiles.selectedLang) {
      SelectLangFile(file)
    }
  } else if (file.endsWith('.hx') && !MapFiles.selectedScript) {
    SelectScriptFile(file)
  }
  
  addToTree(file)
})

export const OnLoadedDirectory = action((c:FSCommandType) => {
  addToTree(c.path, true)
})

export const OnDeleted = action((c:FSCommandType) => {
  removeFromTree(c.path)
})

export const OnLoadedText = action((c:LoadTextCommandType) => {
  MapFiles.progress = c.progress
  MapFiles.lastLoadedFile = c.file
  processTextFile(c.file, c.text)

  SendMsgToGame({
    method: 'load_text_file', 
    data: {
      path: c.file,
      text: c.text
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
