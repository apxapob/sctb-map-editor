import { observable } from 'mobx'
import { EditorStateType, ToolStateType, UnitDataType } from '../types/types'

export const ToolState:ToolStateType = observable({
  radius: 1,
  tool: 'LandUp',
  toolUnit: null,
})

export const SelectedUnits: {
  data: UnitDataType[],
} = observable({
  data: [],
})

export const EditorState:EditorStateType = observable({
  activePanel: null,
  activeTab: 'Field',
})

export const TabsState:{
  [tab: string]: string | null;
} = observable({})

export const TabsErrors:{
  [tab: string]: string | null;
} = observable({})
