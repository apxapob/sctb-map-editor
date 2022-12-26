import { OnLoadedBinary, OnLoadedText, OnLoadingEnd, OnLoadingError, OnLoadingStart } from '../state/actions/OnLoading'
import OpenPanel from '../state/actions/OpenPanel'
import SendMsgToGame from '../state/actions/SendMsgToGame'
import { MapState } from '../state/MapState'
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
      case 'SAVE_CHANGES':
        //TODO: save changes in buffs, units, upgrades, etc.
        MapState.mapInfo && SendMsgToGame({ method: 'save_map', data: MapState.mapInfo.mapId })
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
    }
  })
}
