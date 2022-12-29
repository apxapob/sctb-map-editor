import { action } from 'mobx'
import { LoadBinaryCommandType, LoadTextCommandType } from '../../types/commands'
import { MapInfo } from '../../types/types'
import { INFO_PATH, MapFiles } from '../MapFiles'
import OpenPanel, { ClosePanel } from './OpenPanel'
import SendMsgToGame from './SendMsgToGame'

export const OnLoadingStart = action(() => {
  MapFiles.progress = 0
  MapFiles.text = {}
  MapFiles.binary = {}
  MapFiles.lastLoadedFile = ''
  MapFiles.status = 'Loading'
  MapFiles.error = null
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
