import { action, autorun } from 'mobx'
import { saveAs } from 'file-saver'
import { GameMessage, ToolType } from '../../types/types'
import { PressedKeys } from '../PressedKeys'
import { EditorState, ToolState } from '../ToolState'
import SendMsgToGame from './SendMsgToGame'
import { SendCommand } from '../../utils/messenger'

const OnGameMessage = (msg:GameMessage) => {
  switch (msg.method) {
    case 'init_complete':
      onInitComplete()
      break
    case 'tool_updated':
      onToolUpdated(msg.data)
      break
    case 'on_get_save_info':
      onGetSaveInfo(msg.data)
      break
    case 'text_file_updated':
      SendCommand({ command: 'SAVE_TEXT_FILE', data: msg.data })
      break
    default:
      console.warn('@@@ unknown message', msg)
  }
}

export default action(OnGameMessage)

const onInitComplete = () => {
  autorun(
    () => {
      if (EditorState.activeTab !== 'Field') { return }
      SendMsgToGame({ method: 'keys_pressed', data: PressedKeys })
    }
  )
}

const onToolUpdated = (data:{[index: string]: number | string | boolean}) => {
  ToolState.radius = data.radius as number
  ToolState.tool = data.tool as ToolType
  ToolState.toolUnit = data.toolUnit as string
}

const onGetSaveInfo = async (data: { compressedGameState: string }) => {
  const blob = new Blob([data.compressedGameState], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, 'map.map')
}
