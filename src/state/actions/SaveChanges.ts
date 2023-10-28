import { action } from 'mobx'
import { MapInfo, TabType } from '../../types/types'
import { SendToElectron } from '../../utils/messenger'
import { getFilePath, INFO_PATH, MapFiles } from '../MapFiles'
import { EditorState, TabsErrors, TabsState } from '../ToolState'
import { OnLoadedDirectory, OnLoadedText } from './FileActions'
import SendToGame from './SendToGame'

const SaveChanges = (tab?:TabType):boolean => {
  if (MapFiles.status !== 'Loaded') return false

  if(!tab){
    tab = EditorState.activeTab
  }
  
  if (tab === 'Field') {
    const mapInfo = MapFiles.json[INFO_PATH] as MapInfo
    SendToGame({ method: 'save_map', data: mapInfo.mapId })
    TabsState[tab] = null
    return true
  }
  const path = getFilePath(tab)
  const text = TabsState[tab]
  if (text === null || text === undefined) return true

  try {
    if (path.endsWith('.json')) {
      JSON.parse(text)
    }
    
    TabsState[tab] = null
    TabsErrors[tab] = null
    const data = { text, path }
    SendToElectron({ command: 'SAVE_TEXT_FILE', data })
    OnLoadedText({
      command: 'LOAD_TEXT_FILE',
      file: path,
      progress: 1,
      text
    }, true)
  } catch (e) {
    TabsErrors[tab] = (e as Error).message
    return false
  }
  return true
}

export default action(SaveChanges)

export const CreateFile = action((path:string) => {
  const text = path.endsWith('.json') ? '{}' : ''
  if(!path.includes(".")){
    path += ".txt"
  }
  SendToElectron({
    command: 'SAVE_TEXT_FILE',
    data: { path, text }
  })
  OnLoadedText({
    command: 'LOAD_TEXT_FILE',
    file: path,
    progress: 1,
    text
  })
})

export const CreateFolder = action((path:string) => {
  SendToElectron({ 
    command: 'MAKE_DIR',
    path
  })
  OnLoadedDirectory({
    command: 'LOAD_DIRECTORY',
    path
  })
})
