import { action } from 'mobx'
import { JSONObject, JSONValue, TabType } from '../../types/types'
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

export const GetJsonFileValue = (filePath:string, valuePath:string) => {
  const fileObj = MapFiles.json[filePath]
  let result:JSONValue = fileObj

  const path = valuePath.split('.')
  while (path.length > 0) {
    if (
      typeof result === 'number' ||
      typeof result === 'boolean' ||
      typeof result === 'string' ||
      Array.isArray(result)
    ) {
      console.warn('GetJsonFileValue: wrong value path', filePath, valuePath, fileObj, result)
      return null 
    }
    result = result[path.shift() ?? '']
  }
  
  return result
}

export const AddJsonFileValue = action(<T extends JSONObject>(
  filePath: string,
  defaultName: string,
  template: T,
  selectItem?: (id:string) => void
) => {
  const fileObj = MapFiles.json[filePath]
  let n = 1
  let newId = 'New ' + defaultName
  while (fileObj[newId]) {
    newId = 'New ' + defaultName + n
    n++
  }
  fileObj[newId] = template
  TabsState[EditorState.activeTab] = JSON.stringify(fileObj, null, 2)
  selectItem?.(newId)
})

export const DeleteJsonFileValue = action((
  filePath: string,
  id: string,
) => {
  const fileObj = MapFiles.json[filePath]
  const value = fileObj[id] as JSONObject
  if (!value) return
  
  delete fileObj[id]
  
  TabsState[EditorState.activeTab] = JSON.stringify(fileObj, null, 2)
})

export const RenameJsonFileValue = action((
  filePath: string,
  oldId: string,
  newId: string,
) => {
  const fileObj = MapFiles.json[filePath]
  const value = fileObj[oldId] as JSONObject
  if (!value) return
  
  if (value.type) {
    value.type = newId
  }
  if (value.id) {
    value.id = newId
  }

  delete fileObj[oldId]
  fileObj[newId] = value

  TabsState[EditorState.activeTab] = JSON.stringify(fileObj, null, 2)
})

export const UpdateJsonFileValue = action((
  filePath: string,
  valuePath: string,
  value: JSONValue,
) => {
  const fileObj = MapFiles.json[filePath]
  let targetObj:JSONObject = fileObj

  const path = valuePath.split('.')
  while (path.length > 1) {
    if (
      typeof targetObj === 'number' ||
      typeof targetObj === 'boolean' ||
      typeof targetObj === 'string' ||
      Array.isArray(targetObj)
    ) {
      console.warn('UpdateJsonFileValue: wrong value path', filePath, valuePath, fileObj, targetObj)
      return null 
    }
    targetObj = targetObj[path.shift() ?? ''] as JSONObject
  }
  const lastPathPart = path.shift() ?? ''
  const oldValue = targetObj[lastPathPart]
  if (oldValue === value) return
  targetObj[lastPathPart] = value
  TabsState[EditorState.activeTab] = JSON.stringify(fileObj, null, 2)
})
