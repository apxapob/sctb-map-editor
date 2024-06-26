import { ToolStateChangeType } from '../../types/types'
import { action } from 'mobx'
import { ToolState } from '../ToolState'
import SendToGame from './SendToGame'
import { FIELD_PATH, MapFiles } from '../MapFiles'

const ChangeTool = (newTool:ToolStateChangeType):void => {
  if (newTool.radius)ToolState.radius = Math.max(1, Math.min(10, newTool.radius)) 
  if (newTool.tool)ToolState.tool = newTool.tool
  if (newTool.toolUnit)ToolState.toolUnit = newTool.toolUnit
  if (newTool.toolItem)ToolState.toolItem = newTool.toolItem
  if (newTool.countryId !== undefined)ToolState.countryId = newTool.countryId
  if (newTool.tileType !== undefined)ToolState.tileType = newTool.tileType
  if (newTool.fogOfWarCountryId !== undefined)ChangeFogOfWarCountry(newTool.fogOfWarCountryId)
  
  SendToGame({
    method: 'change_tool',
    data: ToolState
  })
}

export default action(ChangeTool)

export const ChangeFogOfWarCountry = action((newId:number) => {
  ToolState.fogOfWarCountryId = newId
  
  SendToGame({
    method: 'select_country_view', 
    data: { countyId: newId }
  })
})

export const ChangeFieldSize = action((newSize:number) => {
  MapFiles.json[FIELD_PATH].size = Math.max(1, newSize)
  
  SendToGame({
    method: 'change_field_size',
    data: { size: newSize }
  })
})
