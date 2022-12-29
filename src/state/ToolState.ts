import { observable } from 'mobx'
import { EditorStateType, TabType, ToolStateType } from '../types/types'

export const ToolState:ToolStateType = observable({
  radius: 1,
  tool: 'LandUp',
  toolUnit: 'soldier',
  isUnitSelectionOpened: false,
})

export const EditorState:EditorStateType = observable({
  activePanel: null,
  activeTab: 'Field'
})

export const TabsState:{
  [tab: string]: string | null;
} = observable({})

export const TabsErrors:{
  [tab: string]: any;
} = observable({})
