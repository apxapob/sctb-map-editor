import { action, autorun } from 'mobx'
import { GameMessage, ToolType } from '../../types/types'
import { PressedKeys } from '../PressedKeys'
import { EditorState, ToolState } from '../ToolState'
import SendToGame from './SendToGame'
import { SendToElectron } from '../../utils/messenger'
import { OnSelectUnits } from './OnSelectUnits'
import { UpdateUnsavedData } from './UpdateText'
import { processTextFile } from './FileActions'
import SaveChanges from './SaveChanges'
import TestMap from './TestMap'
import ToMainScreen from './ToMainScreen'
import { FIELD_PATH, MapFiles } from '../MapFiles'
import * as Sentry from "@sentry/react";

const OnGameMessage = (msg:GameMessage) => {
  switch (msg.method) {
    case 'report_error':
      const ex = new Error(msg.error)
      ex.stack = msg.details
      Sentry.captureException(ex)
      break
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
      SendToElectron(msg.data, msg.requestId)
      break
    case 'to_main_screen':
      ToMainScreen()
      break
    case 'tool_updated':
      OnToolUpdated(msg.data)
      break
    case 'text_file_updated':
      SendToElectron({ command: 'SAVE_TEXT_FILE', data: msg.data })
      processTextFile(msg.data.path, msg.data.text, false)
      break
    case 'selected_objects':
      OnSelectUnits(msg.data)
      break
    case 'mark_field_unsaved':
      UpdateUnsavedData(FIELD_PATH, 'unsaved')
      break
    case 'update_field_size':
      MapFiles.json[FIELD_PATH].size = msg.data.size
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
