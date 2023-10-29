import { toJS } from 'mobx'
import { EditorState } from '../state/ToolState'
import { OnDeleted, OnLoadedBinary, OnLoadedDirectory, 
  OnLoadedText, OnLoadingEnd, OnLoadingError, 
  OnLoadingStart, OnRenamed } from '../state/actions/FileActions'
import SaveChanges from '../state/actions/SaveChanges'
import SendToGame from '../state/actions/SendToGame'
import TestMap from '../state/actions/TestMap'
import ToggleJsonMode from '../state/actions/ToggleJsonMode'
import { CommandType } from '../types/commands'
import { FilesTree } from '../state/MapFiles'

const { ipcRenderer } = require('electron')

export function SendToElectron(c:CommandType) {
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
      case 'JSON_MODE':
        ToggleJsonMode()
        break
      case 'TO_GAME':
        SendToGame(message.data)
        break
      case 'LOADING_START':
        OnLoadingStart()
        break
      case 'LOADING_END':
        OnLoadingEnd(message.mapId, !message.editMode)
        break
      case 'LOAD_TEXT_FILE':
        OnLoadedText(message)
        break
      case 'LOAD_BINARY_FILE':
        OnLoadedBinary(message)
        break
      case 'LOAD_DIRECTORY':
        OnLoadedDirectory(message)
        break
      case 'LOAD_MAP_ERROR':
        OnLoadingError(message.error)
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
