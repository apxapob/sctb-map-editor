import { action } from 'mobx'
import { TabType } from '../../types/types'
import { EditorState, TabsState } from '../ToolState'
import { MapFiles, getFilePath } from '../MapFiles'

export const UpdateUnsavedData = action((tab:TabType, text:string|null) => {
  TabsState[tab] = text
})

export const CancelUnsavedData = action(() => {
  TabsState[EditorState.activeTab] = null
  const filePath = getFilePath(EditorState.activeTab)
  MapFiles.json[filePath] = JSON.parse(MapFiles.text[filePath])
})

export const UpdateMapJsonFile = action((
  filePath: string,
  valuePath: string,
  value: string,
) => {
  MapFiles.json[filePath][valuePath] = value
  TabsState[EditorState.activeTab] = JSON.stringify(MapFiles.json[filePath], null, 2)
})
