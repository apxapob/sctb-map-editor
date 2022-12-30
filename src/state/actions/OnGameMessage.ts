import { action, autorun } from 'mobx'
import { GameMessage, ToolType } from '../../types/types'
import { PressedKeys } from '../PressedKeys'
import { EditorState, ToolState } from '../ToolState'
import SendMsgToGame from './SendMsgToGame'
import { SendCommand } from '../../utils/messenger'
import { OnSelectUnits } from './OnSelectUnits'

const OnGameMessage = (msg:GameMessage) => {
  switch (msg.method) {
    case 'init_complete':
      OnInitComplete()
      break
    case 'tool_updated':
      OnToolUpdated(msg.data)
      break
    case 'text_file_updated':
      SendCommand({ command: 'SAVE_TEXT_FILE', data: msg.data })
      break
    case 'selected_units':
      OnSelectUnits(msg.data)
      break
    default:
      console.warn('unknown message', msg)
  }
}

export default action(OnGameMessage)

const OnInitComplete = () => {
  autorun(
    () => {
      if (EditorState.activeTab !== 'Field') { return }
      SendMsgToGame({ method: 'keys_pressed', data: PressedKeys })
    }
  )
}

const OnToolUpdated = action((data:{[index: string]: number | string | boolean}) => {
  ToolState.radius = data.radius as number
  ToolState.tool = data.tool as ToolType
  ToolState.toolUnit = data.toolUnit as string
})
