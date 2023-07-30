import { action } from 'mobx'
import { EditorState } from '../ToolState'

const ToMainScreen = () => {
  EditorState.mode = 'play'
}

export default action(ToMainScreen)
