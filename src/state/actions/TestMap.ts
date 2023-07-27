import { action } from 'mobx'
import { MapFiles } from '../MapFiles'
import { EditorState } from '../ToolState'
import SendMsgToGame from './SendMsgToGame'

const TestMap = () => {
  if (MapFiles.status !== 'Loaded' || EditorState.mode === 'play') return
  EditorState.mode = EditorState.mode === 'edit' ? 'test' : 'edit'
  EditorState.activeTab = 'Field'
  SendMsgToGame({ method: 'test_map' })
}

export default action(TestMap)
