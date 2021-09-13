import { PanelType } from '../../types/types'
import { action } from 'mobx'
import { ToolState } from '../ToolState'

const OpenPanel = (panel:PanelType):void => {
  ToolState.activePanel = panel
}

export default action(OpenPanel)

export const ClosePanel = action(
  ():void => {
    ToolState.activePanel = null
  }
)
