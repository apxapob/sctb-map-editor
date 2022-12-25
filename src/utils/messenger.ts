import { OnLoadedBinary, OnLoadedText, OnLoadingEnd, OnLoadingStart } from '../state/actions/OnLoadingStart'
import OpenPanel from '../state/actions/OpenPanel'
import { CommandType } from '../types/commands'

const { ipcRenderer } = require('electron')

export function SendCommand(c:CommandType) {
  ipcRenderer.send('commands', c)
}

export function InitMessenger() {
  ipcRenderer.on('commands', (event:Event, message:CommandType) => {
    switch (message.command) {
      case 'NEW_MAP':
        OpenPanel('NewMap')
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
    }
  })
}
