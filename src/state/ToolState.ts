import { observable } from 'mobx'
import { ToolStateType } from '../types/types'

export const ToolState:ToolStateType = observable({
  radius: 1,
  tool: 'LandUp',
  toolUnit: 'soldier',
  isUnitSelectionOpened: false,
  activePanel: null
})
