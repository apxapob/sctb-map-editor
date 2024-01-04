import { action } from 'mobx'
import { MapInfo, TabType } from '../../types/types'
import { SendToElectron } from '../../utils/messenger'
import { FIELDS_PATH, getFilePath, INFO_PATH, MapFiles } from '../MapFiles'
import { EditorState, FileErrors, UnsavedFiles } from '../ToolState'
import { OnLoadedDirectory, OnLoadedText } from './FileActions'
import SendToGame from './SendToGame'

const SaveChanges = (tab?:TabType):boolean => {
  if (MapFiles.status !== 'Loaded') return false

  tab ??= EditorState.activeTab
  
  if (tab === 'Field') {
    const mapInfo = MapFiles.json[INFO_PATH] as MapInfo
    SendToGame({ method: 'save_map', data: mapInfo.mapId })
    for(const file in UnsavedFiles){
      if(file.startsWith(FIELDS_PATH)){
        delete UnsavedFiles[file]
      }
    }
    
    return true
  }
  const path = getFilePath(tab)
  const text = UnsavedFiles[path]
  if (text === null || text === undefined) return true

  try {
    if (path.endsWith('.json')) {
      JSON.parse(text)
    }
    const data = { text, path }
    
    delete UnsavedFiles[path]
    delete FileErrors[path]
    
    SendToElectron({ command: 'SAVE_TEXT_FILE', data })
    OnLoadedText({
      command: 'LOAD_TEXT_FILE',
      file: path,
      progress: 1,
      editMode: true,
      gameFile: false,
      text
    }, true)
  } catch (e) {
    FileErrors[path] = (e as Error).message
    return false
  }
  return true
}

export default action(SaveChanges)

export const CreateFile = action((path:string) => {
  let text = path.endsWith('.json') ? '{}' : ''
  if(path.endsWith('.hx')) text = 
`
trace("Hello World! I'm ${path.split('/').pop()} script.");

trace(vars);   //All game variables
trace(funcs);  //All game functions
trace(HexMath);//Util math functions for hexagonal calculations
trace(Math);   //Util math functions
`

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
    text,
    gameFile: false,
    editMode: true
  })
})

export const CreateFolder = action((path:string) => {
  SendToElectron({ 
    command: 'MAKE_DIR',
    path,
    editMode: true
  })
  OnLoadedDirectory({
    command: 'LOAD_DIRECTORY',
    path,
    editMode: true
  })
})
