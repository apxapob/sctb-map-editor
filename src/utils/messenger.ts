import { OnDeleted, OnLoadedBinary, OnLoadedDirectory, 
  OnLoadedText, OnLoadingEnd, OnLoadingError, 
  OnLoadingStart, OnRenamed } from '../state/actions/FileActions'
import SaveChanges from '../state/actions/SaveChanges'
import TestMap from '../state/actions/TestMap'
import { CommandType } from '../types/commands'

const { ipcRenderer } = require('electron')

export function SendCommand(c:CommandType) {
  ipcRenderer.send('commands', c)
}

export function InitMessenger() {
  ipcRenderer.on('commands', (event:Event, message:CommandType) => {
    switch (message.command) {
      case 'SAVE_CHANGES':
        SaveChanges()
        break
      case 'TEST_MAP':
        TestMap()
        break
      case 'LOADING_START':
        OnLoadingStart()
        break
      case 'LOADING_END':
        OnLoadingEnd()
        break
      case 'LOAD_TEXT_FILE':
        OnLoadedText(message)
        break
      case 'LOAD_BINARY_FILE':
        OnLoadedBinary(message)
        break
      case 'LOAD_MAP_ERROR':
        OnLoadingError(message.error)
        break
      case 'LOAD_DIRECTORY':
        OnLoadedDirectory(message)
        break
      case 'DELETED':
        OnDeleted(message)
        break
      case 'RENAMED':
        OnRenamed(message)
        break
    }
  })
}
