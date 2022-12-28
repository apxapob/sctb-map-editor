import { PanelType, TabType } from '../../types/types'
import { action } from 'mobx'
import { EditorState } from '../ToolState'

const OpenPanel = (panel:PanelType):void => {
  EditorState.activePanel = panel
}

export default action(OpenPanel)

export const ClosePanel = action(
  ():void => {
    EditorState.activePanel = null
  }
)

export const SelectTab = action(
  (tab:TabType):void => {
    EditorState.activeTab = tab
  }
)
