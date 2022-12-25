import { action } from 'mobx'
import { LoadBinaryCommandType, LoadTextCommandType } from '../../types/commands'
import { MapFiles } from '../MapFiles'
import { MapState } from '../MapState'
import OpenPanel, { ClosePanel } from './OpenPanel'

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
  if (MapFiles.text['info.json'] !== undefined) {
    MapFiles.status = 'Loaded'
    MapState.mapInfo = JSON.parse(MapFiles.text['info.json'])
    ClosePanel()
  } else {
    OnLoadingError('Can\'t find info.json file')
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
})

export const OnLoadedBinary = action((c:LoadBinaryCommandType) => {
  MapFiles.binary[c.file] = c.bytes.length
  MapFiles.progress = c.progress
  MapFiles.lastLoadedFile = c.file
})
