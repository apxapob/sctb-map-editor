import { action } from 'mobx'
import { MapInfo, TabType } from '../../types/types'
import { SendToElectron } from '../../utils/messenger'
import { FIELD_PATH, getFilePath, INFO_PATH, ITEMS_IMAGES_PATH, MapFiles, UNITS_IMAGES_PATH } from '../MapFiles'
import { EditorState, FileErrors, UnsavedFiles } from '../ToolState'
import { OnLoadedDirectory, OnLoadedText } from './FileActions'
import SendToGame from './SendToGame'

const SaveChanges = (tab?:TabType) => {
  if (MapFiles.status !== 'Loaded') return

  tab ??= EditorState.activeTab
  
  if (tab === 'Field') {
    const mapInfo = MapFiles.json[INFO_PATH] as MapInfo
    SendToGame({ method: 'save_map', data: mapInfo.mapId })
    for(const file in UnsavedFiles){
      if(file === FIELD_PATH){
        delete UnsavedFiles[file]
      }
    }
    
    return
  }

  const filesToSave = [getFilePath(tab)]
  if(tab === 'Units' || tab === 'Items'){
    const directory = tab === 'Units' ? UNITS_IMAGES_PATH : ITEMS_IMAGES_PATH
    for(const file in UnsavedFiles){
      if(file.startsWith(directory)){
        filesToSave.push(file)
      }
    }
  }
  
  for(const file in filesToSave){
    SaveFile(filesToSave[file])
  }
}

export const SaveFile = action((path:string) => {
  const text = UnsavedFiles[path]
  if (text === null || text === undefined) return

  try {
    if (path.endsWith('.json')) { JSON.parse(text) }
    const data = { text, path }
    
    delete UnsavedFiles[path]
    delete FileErrors[path]
    
    SendToElectron({ command: 'SAVE_TEXT_FILE', data })
    OnLoadedText({
      command: 'LOAD_TEXT_FILE',
      file: path,
      progress: 1,
      mode: 'edit',
      gameFile: false,
      text
    }, true)
  } catch (e) {
    FileErrors[path] = (e as Error).message
  }
})

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
    mode: 'edit'
  })
})

export const CreateFolder = action((path:string) => {
  SendToElectron({ command: 'MAKE_DIR', path })
  OnLoadedDirectory({
    command: 'LOAD_DIRECTORY',
    path,
    mode: 'edit'
  })
})
