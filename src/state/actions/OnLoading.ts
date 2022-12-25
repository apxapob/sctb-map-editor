import { action } from 'mobx'
import { LoadBinaryCommandType, LoadTextCommandType } from '../../types/commands'
import { MapFiles } from '../MapFiles'
import { MapState } from '../MapState'
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
    if (MapFiles.text['info.json'] !== undefined) {
      MapFiles.status = 'Loaded'
      MapState.mapInfo = JSON.parse(MapFiles.text['info.json'])
      if (MapState.mapInfo && MapState.mapInfo.mapId) {
        ClosePanel()
        SendMsgToGame({ method: 'show_map_editor', data: MapState.mapInfo.mapId })
      } else {
        OnLoadingError('Invalid info.json file: no mapId')
      }
    } else {
      OnLoadingError('Can\'t find info.json file')
    }
  } catch (e:any) {
    OnLoadingError('Invalid info.json file: ' + e.message)
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
