import OnGameMessage from './OnGameMessage'
import { GameMessage } from '../../types/types'
import { action } from 'mobx'
import { PressedKeys } from '../PressedKeys'

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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron')

ipcRenderer.on('electron-message', (event:any, message:string) => {
  console.log('!!!electron-message', message, event) // Prints 'whoooooooh!'
})
