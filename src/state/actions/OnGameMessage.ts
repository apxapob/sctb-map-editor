import { action, autorun } from 'mobx'
import { GameMessage, ToolType } from '../../types/types'
import { PressedKeys, ToolState } from '../MapState'
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
  },
  tool_updated: (msg:GameMessage) => {
    const data = msg.data as {[index: string]: number | string | boolean}
    ToolState.radius = data.radius as number
    ToolState.tool = data.tool as ToolType
    ToolState.toolUnit = data.toolUnit as string
  }
}
