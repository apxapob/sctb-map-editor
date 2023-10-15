import OnGameMessage from './OnGameMessage'
import { GameMessage } from '../../types/types'
import { action } from 'mobx'
import { PressedKeys } from '../PressedKeys'
import { InitMessenger } from '../../utils/messenger'

export const Initialize = ():void => {
  window.onmessage = event => {
    if (typeof event.data !== 'string') {
      return
    }
    OnGameMessage(JSON.parse(event.data) as GameMessage)
  }
  window.onkeyup = action(e => { delete PressedKeys[e.keyCode] })
  window.onkeydown = action(e => {
    PressedKeys[e.keyCode] = 'pressed' 
  })
  window.onblur = action(() => {
    for (const key in PressedKeys) {
      delete PressedKeys[key]
    }
  })
  
  InitMessenger()
}
