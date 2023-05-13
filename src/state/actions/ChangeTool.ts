import { ToolStateChangeType } from '../../types/types'
import { action } from 'mobx'
import { ToolState } from '../ToolState'
import SendMsgToGame from './SendMsgToGame'
import { FIELDS_PATH, MapFiles } from '../MapFiles'

const ChangeTool = (newTool:ToolStateChangeType):void => {
  if (newTool.radius)ToolState.radius = Math.max(1, Math.min(10, newTool.radius)) 
  if (newTool.tool)ToolState.tool = newTool.tool
  if (newTool.toolUnit)ToolState.toolUnit = newTool.toolUnit
  if (newTool.toolItem)ToolState.toolItem = newTool.toolItem
  
  SendMsgToGame({
    method: 'change_tool',
    data: ToolState
  })
}

export default action(ChangeTool)

export const ChangeFogOfWarCountry = action((newId:number) =>{
  ToolState.fogOfWarCountryId = newId
  
  SendMsgToGame({
    method: 'select_country_view', 
    data: { countyId: newId }
  })
})

export const ChangeFieldSize = action((newSize:number) =>{
  MapFiles.json[FIELDS_PATH + ToolState.currentField].size = Math.max(1, newSize)
  
  SendMsgToGame({
    method: 'change_field_size',
    data: { size: newSize }
  })
})
