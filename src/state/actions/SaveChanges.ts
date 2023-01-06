import { action } from 'mobx'
import { MapInfo } from '../../types/types'
import { SendCommand } from '../../utils/messenger'
import { getFilePath, INFO_PATH, MapFiles } from '../MapFiles'
import { EditorState, TabsErrors, TabsState } from '../ToolState'
import { OnLoadedText } from './OnLoading'
import SendMsgToGame from './SendMsgToGame'

const SaveChanges = ():void => {
  if (MapFiles.status !== 'Loaded') return
  
  if (EditorState.activeTab === 'Field') {
    const mapInfo = MapFiles.json[INFO_PATH] as MapInfo
    SendMsgToGame({ method: 'save_map', data: mapInfo.mapId })
    TabsState[EditorState.activeTab] = null
    return
  }
  const path = getFilePath(EditorState.activeTab)
  const text = TabsState[EditorState.activeTab]
  if (text === null) return

  try {
    if (path.endsWith('.json')) {
      JSON.parse(text)
    }
    
    TabsState[EditorState.activeTab] = null
    TabsErrors[EditorState.activeTab] = null
    const data = { text, path }
    SendCommand({ command: 'SAVE_TEXT_FILE', data })
    OnLoadedText({
      command: 'LOAD_TEXT_FILE',
      file: path,
      progress: 1,
      text
    })
  } catch (e) {
    TabsErrors[EditorState.activeTab] = (e as Error).message
  }
}

export default action(SaveChanges)

export const CreateFile = action((path:string) => {
  SendCommand({ 
    command: 'SAVE_TEXT_FILE',
    data: { path, text: '' }
  })
  OnLoadedText({
    command: 'LOAD_TEXT_FILE',
    file: path,
    progress: 1,
    text: ''
  })
})

export const CreateFolder = action((path:string) => {
  SendCommand({ 
    command: 'MAKE_DIR',
    path
  })
})
