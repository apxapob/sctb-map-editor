import { action } from 'mobx'
import { ToolState } from '../ToolState'
import ChangeTool from './ChangeTool'

const SelectUnitType = (type:string):void => {
  ToolState.toolUnit = type
  ToolState.isUnitSelectionOpened = false
  ChangeTool({ tool: 'CreateUnits', toolUnit: type })
}

export default action(SelectUnitType)
