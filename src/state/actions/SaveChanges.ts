import { action } from 'mobx'
import { getFilePath } from '../../components/App'
import { SendCommand } from '../../utils/messenger'
import { MapFiles } from '../MapFiles'
import { MapState } from '../MapState'
import { EditorState, TabsErrors, TabsState } from '../ToolState'
import SendMsgToGame from './SendMsgToGame'

const SaveChanges = ():void => {
  if (MapState.mapInfo === null) return
  
  if (EditorState.activeTab === 'Field') {
    SendMsgToGame({ method: 'save_map', data: MapState.mapInfo.mapId })
    return
  }
  const path = getFilePath(EditorState.activeTab)
  const text = TabsState[EditorState.activeTab]
  if (text === null) return

  try {
    JSON.parse(text)
    MapFiles.text[path] = text
    TabsState[EditorState.activeTab] = null
    TabsErrors[EditorState.activeTab] = null
    const data = { text, path }
    SendCommand({ command: 'SAVE_TEXT_FILE', data })
    SendMsgToGame({ method: 'load_text_file', data })
  } catch (e) {
    TabsErrors[EditorState.activeTab] = (e as Error).message
  }
}

export default action(SaveChanges)
