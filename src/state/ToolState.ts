import { observable } from 'mobx'
import { EditorStateType, ItemDataType, TabType, ToolStateType, UnitDataType } from '../types/types'

export const ToolState:ToolStateType = observable({
  fogOfWarCountryId: 0,
  radius: 1,
  tool: 'Select',
  toolUnit: null,
  toolItem: null,
  tileType: 0,
  countryId: 0
})

export const SelectedObjects: {
  data: (ItemDataType | UnitDataType)[],
} = observable({
  data: [],
})

export const EditorState:EditorStateType = observable({
  activeTab: 'Field',
  beforeTestTab: 'Field',
  mode: 'play',
  editorTrigger: false
})

export const UnsavedFiles:{
  [path:string]: string;
} = observable({})

export const FileErrors:{
  [path:string]: string;
} = observable({})
