import { action, autorun } from 'mobx'
import { GameMessage, ToolType } from '../../types/types'
import { PressedKeys } from '../PressedKeys'
import { EditorState, ToolState } from '../ToolState'
import SendMsgToGame from './SendMsgToGame'
import { SendCommand } from '../../utils/messenger'
import { OnSelectUnits } from './OnSelectUnits'
import { UpdateUnsavedData } from './UpdateText'
import { processTextFile } from './FileActions'
import CreateMap from './CreateMap'

const OnGameMessage = (msg:GameMessage) => {
  switch (msg.method) {
    case 'init_complete':
      OnInitComplete()
      break
    case 'load_saves_list':
      SendCommand({ command: 'LOAD_SAVES_LIST' })
      break
    case 'delete_save_file':
      SendCommand({ command: 'DELETE_SAVE_FILE', data: msg.data })
      break 
    case 'save_file':
      SendCommand({ 
        command: 'SAVE_GAME', 
        data: { 
          path: msg.data.filename, 
          text: msg.data.content 
        }
      })
      break
    case 'load_game':
      SendCommand({ command: 'LOAD_GAME', data: msg.data })
      break
    case 'to_electron':
      SendCommand(msg.data)
      break
    case 'tool_updated':
      OnToolUpdated(msg.data)
      break
    case 'exit':
      SendCommand({ command: 'EXIT' })
      break
    case 'load_maps_list':
      SendCommand({ command: 'LOAD_MAPS_LIST' })
      break
    case 'text_file_updated':
      SendCommand({ command: 'SAVE_TEXT_FILE', data: msg.data })
      processTextFile(msg.data.path, msg.data.text)
      break
    case 'selected_objects':
      OnSelectUnits(msg.data)
      break
    case 'mark_field_unsaved':
      UpdateUnsavedData('Field', 'unsaved')
      break
    case 'create_map':
      CreateMap()
      break
    case 'open_map':
      SendCommand({ command: 'OPEN_MAP', data: msg.data })
      break
    case 'edit_map':
      SendCommand({ command: 'EDIT_MAP' })
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
  ToolState.toolItem = data.toolItem as string
})
