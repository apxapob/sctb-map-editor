import { observable } from 'mobx'
import { EditorStateType, TabType, ToolStateType, UnitDataType } from '../types/types'

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
  [tab in TabType]?: string | null;
} = observable({})

export const TabsErrors:{
  [tab in TabType]?: string | null;
} = observable({})
