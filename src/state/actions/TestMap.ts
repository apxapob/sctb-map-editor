import { action } from 'mobx'
import { MapFiles } from '../MapFiles'
import { EditorState } from '../ToolState'
import SendToGame from './SendToGame'

const TestMap = () => {
  if (MapFiles.status !== 'Loaded' || EditorState.mode === 'play') return
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
