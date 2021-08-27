import { action, autorun } from 'mobx'
import { GameMessage } from '../../types/types'
import { PressedKeys } from '../MapState'
import SendMsgToGame from './SendMsgToGame'

const OnGameMessage = (msg:GameMessage) => {
  console.log('@@@ OnGameMessage', msg)
  const handler = eventHandlers[msg.method]
  if (handler) {
    handler(msg)
  } else {
    console.warn('@@@ unknown message', msg)
  }
}

export default action(OnGameMessage)

const eventHandlers: { [methodName: string]: (msg:GameMessage) => void } = {
  init_complete: () => {
    SendMsgToGame({ method: 'show_map_editor' })
    autorun(
      () => SendMsgToGame({ method: 'keys_pressed', data: PressedKeys })
    )
  }
}
