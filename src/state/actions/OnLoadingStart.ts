import { action } from 'mobx'
import { LoadBinaryCommandType, LoadTextCommandType } from '../../types/commands'
import { MapFiles } from '../MapFiles'
import OpenPanel, { ClosePanel } from './OpenPanel'

export const OnLoadingStart = action(() => {
  MapFiles.progress = 0
  MapFiles.lastLoadedFile = ''
  OpenPanel('LoadingMap')
})

export const OnLoadingEnd = action(() => {
  MapFiles.progress = 1
  //ClosePanel()
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
