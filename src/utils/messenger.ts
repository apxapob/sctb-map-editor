import { EditorState } from '../state/ToolState'
import { OnDeleted, OnLoadedBinary, OnLoadedDirectory, 
  OnLoadedText, OnLoadingEnd, OnLoadingError, 
  OnLoadingStart, OnRenamed } from '../state/actions/FileActions'
import SaveChanges from '../state/actions/SaveChanges'
import SendToGame from '../state/actions/SendToGame'
import TestMap from '../state/actions/TestMap'
import ToggleJsonMode from '../state/actions/ToggleJsonMode'
import { CommandType } from '../types/commands'

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
      case 'MAPS_LIST':
        SendToGame({ method: 'maps_list', data: message.maps })
        break
      case 'LOADING_START':
        OnLoadingStart()
        break
      case 'LOADING_END':
        OnLoadingEnd(!message.forEditing)
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
      case 'SAFE_FILE_LOADED':
        SendToGame({ 
          method: 'save_file_loaded', 
          data: message.data
        })
        break
      case 'SAVES_LIST':
        SendToGame({ method: 'saves_list', data: message.saves })
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
