import { action, toJS } from 'mobx'
import { MapFiles } from '../MapFiles'
import { EditorState, UnsavedFiles } from '../ToolState'
import SendToGame from './SendToGame'
import { SendToElectron } from '../../utils/messenger'

const TestMap = () => {
  if (MapFiles.status !== 'Loaded' || EditorState.mode === 'play') return

  const unsavedTabs = Object.keys(toJS(UnsavedFiles))
  if(unsavedTabs.length > 0){
    SendToElectron({
      command: 'SHOW_MESSAGE',
      title: 'Can\'t test map',
      message: 'Please save changes in those tabs: ' + unsavedTabs.join()
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
  
  SendToGame({ method: 'test_map', data: EditorState.mode })
}

export default action(TestMap)
