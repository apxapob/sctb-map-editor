import OnGameMessage from './OnGameMessage'
import { GameMessage } from '../../types/types'
import { action } from 'mobx'
import { PressedKeys } from '../PressedKeys'
import { CommandType } from '../../types/commands'
import OpenPanel from './OpenPanel'

export const Initialize = ():void => {
  window.onmessage = event => {
    console.log('!!! window.onmessage', event)
    if (typeof event.data !== 'string') {
      return
    }
    OnGameMessage(JSON.parse(event.data) as GameMessage)
  }
  window.onkeyup = action(e => { delete PressedKeys[e.code] })
  window.onkeydown = action(e => { PressedKeys[e.code] = 'pressed' })//TODO: hot keys here
}

const { ipcRenderer } = require('electron')
ipcRenderer.on('electron-message', (event:Event, message:CommandType) => {
  switch (message.command) {
    case 'NEW_MAP':
      OpenPanel('NewMap')
  }
})
