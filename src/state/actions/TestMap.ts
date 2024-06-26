import { action, toJS } from 'mobx'
import { MapFiles } from '../MapFiles'
import { EditorState, TestingSettings, UnsavedFiles } from '../ToolState'
import SendToGame from './SendToGame'
import { SendToElectron } from '../../utils/messenger'

const TestMap = () => {
  if (MapFiles.status !== 'Loaded' || EditorState.mode === 'play') return

  const unsavedTabs = Object.keys(toJS(UnsavedFiles))
  if(unsavedTabs.length > 0){
    SendToElectron({
      command: 'SHOW_MESSAGE',
      title: 'Can\'t test map',
      message: 'Can\'t test map. Please save changes.'
    })
    return
  }
  

  EditorState.mode = EditorState.mode === 'edit' ? 'test' : 'edit'
  if(EditorState.mode === "test"){
    EditorState.beforeTestTab = EditorState.activeTab
    EditorState.activeTab = 'Field'
  } else {
    EditorState.activeTab = EditorState.beforeTestTab
  }
  
  SendToGame({ 
    method: 'test_map',
    data: {
      mode: EditorState.mode,
      players: JSON.stringify(TestingSettings.players)
    }
  })
}

export default action(TestMap)
