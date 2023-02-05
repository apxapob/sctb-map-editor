import { action } from 'mobx'
import { ToolState } from '../ToolState'
import ChangeTool from './ChangeTool'

const SelectItemType = (type:string, changeTool = true):void => {
  ToolState.toolItem = type
  if (changeTool) {
    ChangeTool({ tool: 'CreateItems', toolItem: type })
  } else {
    ChangeTool({ toolItem: type })
  }
}

export default action(SelectItemType)
