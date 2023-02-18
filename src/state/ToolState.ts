import { observable } from 'mobx'
import { EditorStateType, ItemDataType, TabType, ToolStateType, UnitDataType } from '../types/types'

export const ToolState:ToolStateType = observable({
  radius: 1,
  tool: 'Select',
  toolUnit: null,
  toolItem: null,
})

export const SelectedObjects: {
  data: (ItemDataType | UnitDataType)[],
} = observable({
  data: [],
})

export const EditorState:EditorStateType = observable({
  activePanel: null,
  activeTab: 'Field',
  mapTesting: false
})

export const TabsState:{
  [tab in TabType]?: string | null;
} = observable({})

export const TabsErrors:{
  [tab in TabType]?: string | null;
} = observable({})
