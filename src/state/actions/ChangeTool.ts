import { ToolStateChangeType } from '../../types/types'
import { action } from 'mobx'
import { ToolState } from '../ToolState'
import SendMsgToGame from './SendMsgToGame'

const ChangeTool = (newTool:ToolStateChangeType):void => {
  if (newTool.radius)ToolState.radius = Math.max(1, Math.min(10, newTool.radius)) 
  if (newTool.tool)ToolState.tool = newTool.tool
  if (newTool.toolUnit)ToolState.toolUnit = newTool.toolUnit
  
  SendMsgToGame({
    method: 'change_tool',
    data: ToolState
  })
}

export default action(ChangeTool)
