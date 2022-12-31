import { action } from 'mobx'
import { ToolState } from '../ToolState'
import ChangeTool from './ChangeTool'

const SelectUnitType = (type:string, changeTool = true):void => {
  ToolState.toolUnit = type
  if (changeTool) {
    ChangeTool({ tool: 'CreateUnits', toolUnit: type })
  } else {
    ChangeTool({ toolUnit: type })
  }
}

export default action(SelectUnitType)
