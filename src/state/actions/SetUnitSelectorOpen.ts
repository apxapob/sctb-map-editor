import { action } from 'mobx'
import { ToolState } from '../ToolState'

const SetUnitSelectorOpen = (val:boolean):void => {
  ToolState.isUnitSelectionOpened = val
}

export default action(SetUnitSelectorOpen)
