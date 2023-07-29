import { action, autorun } from 'mobx'
import { GameMessage, ToolType } from '../../types/types'
import { PressedKeys } from '../PressedKeys'
import { EditorState, ToolState } from '../ToolState'
import SendToGame from './SendToGame'
import { SendToElectron } from '../../utils/messenger'
import { OnSelectUnits } from './OnSelectUnits'
import { UpdateUnsavedData } from './UpdateText'
import { processTextFile } from './FileActions'
import CreateMap from './CreateMap'

const OnGameMessage = (msg:GameMessage) => {
  switch (msg.method) {
    case 'init_complete':
      OnInitComplete()
      break
    case 'save_file':
      SendToElectron({ 
        command: 'SAVE_GAME', 
        data: { 
          path: msg.data.filename, 
          text: msg.data.content 
        }
      })
      break
    case 'load_game':
      SendToElectron({ command: 'LOAD_GAME', data: msg.data })
      break
    case 'to_electron':
      SendToElectron(msg.data)
      break
    case 'tool_updated':
      OnToolUpdated(msg.data)
      break
    case 'exit':
      SendToElectron({ command: 'EXIT' })
      break
    case 'load_maps_list':
      SendToElectron({ command: 'LOAD_MAPS_LIST' })
      break
    case 'text_file_updated':
      SendToElectron({ command: 'SAVE_TEXT_FILE', data: msg.data })
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
      SendToElectron({ command: 'OPEN_MAP', data: msg.data })
      break
    case 'edit_map':
      SendToElectron({ command: 'EDIT_MAP' })
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
      SendToGame({ method: 'keys_pressed', data: PressedKeys })
    }
  )
}

const OnToolUpdated = action((data:{[index: string]: number | string | boolean}) => {
  ToolState.radius = data.radius as number
  ToolState.tool = data.tool as ToolType
  ToolState.toolUnit = data.toolUnit as string
  ToolState.toolItem = data.toolItem as string
})
