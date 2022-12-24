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
    }
  })
}
