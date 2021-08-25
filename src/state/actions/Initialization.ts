import OnGameMessage from './OnGameMessage'
import { GameMessage } from '../../types/types'

export const Initialize = ():void => {
  window.onmessage = event => {
    OnGameMessage(JSON.parse(event.data) as GameMessage)
  }
}
