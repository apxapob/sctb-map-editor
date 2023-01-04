import { action } from 'mobx'
import { LoadBinaryCommandType, LoadTextCommandType } from '../../types/commands'
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

export const OnLoadedText = action((c:LoadTextCommandType) => {
  MapFiles.text[c.file] = c.text
  MapFiles.progress = c.progress
  MapFiles.lastLoadedFile = c.file
  SendMsgToGame({ 
    method: 'load_text_file', 
    data: {
      path: c.file,
      text: c.text
    }
  })

  if (c.file.endsWith('.json')) {
    MapFiles.json[c.file] = JSON.parse(c.text)
    if (c.file.startsWith(TEXTS_PATH) && !MapFiles.selectedLang) {
      SelectLangFile(c.file)
    }
  } else if (c.file.endsWith('.hx') && !MapFiles.selectedScript) {
    SelectScriptFile(c.file)
  }
  
  const parts = c.file.split('\\')
  let curPart = ''
  let curTree:PathTreeType = FilesTree
  for (let i = 0; i < parts.length; i++) {
    curPart = parts[i]
    if (!(curPart in curTree.nodes)) {
      curTree.nodes[curPart] = {
        isOpen: true, 
        nodes: {}, 
        path: curTree.path === '' ? curPart : curTree.path + '\\' + curPart
      }
    }
    curTree = curTree.nodes[curPart]
  }
})

export const OnLoadedBinary = action((c:LoadBinaryCommandType) => {
  MapFiles.binary[c.file] = c.bytes.length
  MapFiles.progress = c.progress
  MapFiles.lastLoadedFile = c.file
  SendMsgToGame({
    method: 'load_binary_file', 
    data: {
      path: c.file,
      bytes: c.bytes
    }
  })
})
