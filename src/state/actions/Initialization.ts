import OnGameMessage from './OnGameMessage'
import { GameMessage } from '../../types/types'
import { action } from 'mobx'
import { PressedKeys } from '../PressedKeys'

export const Initialize = ():void => {
  window.onmessage = event => {
    OnGameMessage(JSON.parse(event.data) as GameMessage)
  }
  window.onkeyup = action(e => { delete PressedKeys[e.code] })
  window.onkeydown = action(e => { PressedKeys[e.code] = 'pressed' })
}
