import { action } from 'mobx'
import { MapFiles } from '../MapFiles'
import { EditorState } from '../ToolState'
import SendMsgToGame from './SendMsgToGame'

const TestMap = () => {
  if (MapFiles.status !== 'Loaded') return
  EditorState.mapTesting = !EditorState.mapTesting
  SendMsgToGame({ method: 'test_map' })
}

export default action(TestMap)
