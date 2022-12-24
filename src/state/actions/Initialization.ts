import OnGameMessage from './OnGameMessage'
import { GameMessage } from '../../types/types'
import { action } from 'mobx'
import { PressedKeys } from '../PressedKeys'
import { InitMessenger } from '../../utils/messenger'

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
  InitMessenger()
}
