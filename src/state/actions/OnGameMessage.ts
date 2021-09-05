import { action, autorun } from 'mobx'
import { GameMessage, MapSettingsType, ToolType } from '../../types/types'
import { MapState } from '../MapState'
import { PressedKeys } from '../PressedKeys'
import { ToolState } from '../ToolState'
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
  init_complete: msg => {
    SendMsgToGame({ method: 'show_map_editor' })
    autorun(
      () => SendMsgToGame({ method: 'keys_pressed', data: PressedKeys })
    )
    MapState.settings = msg.data as MapSettingsType
  },
  tool_updated: msg => {
    const data = msg.data as {[index: string]: number | string | boolean}
    ToolState.radius = data.radius as number
    ToolState.tool = data.tool as ToolType
    ToolState.toolUnit = data.toolUnit as string
  }
}
