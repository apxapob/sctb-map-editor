import { TabType } from '../../types/types'
import { action } from 'mobx'
import { EditorState } from '../ToolState'

export const SelectTab = action(
  (tab:TabType):void => {
    EditorState.activeTab = tab
  }
)
