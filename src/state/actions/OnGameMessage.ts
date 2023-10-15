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
import SaveChanges from './SaveChanges'
import TestMap from './TestMap'
import ToMainScreen from './ToMainScreen'
import { MapFiles } from '../MapFiles'

const OnGameMessage = (msg:GameMessage) => {
  switch (msg.method) {
    case 'init_complete':
      OnInitComplete()
      break
    case 'save_changes':
      SaveChanges()
      break
    case 'test_map':
      TestMap()
      break
    case 'to_electron':
      SendToElectron(msg.data)
      break
    case 'to_main_screen':
      ToMainScreen()
      break
    case 'tool_updated':
      OnToolUpdated(msg.data)
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
    case 'update_field_size':
      MapFiles.json[MapFiles.selectedField].size = msg.data.size
      break
    case 'create_map':
      CreateMap()
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
