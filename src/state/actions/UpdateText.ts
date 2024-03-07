import { action } from 'mobx'
import { EffectTemplates, EffectType, Effects, JSONObject, JSONValue, TabType } from '../../types/types'
import { EditorState, UnsavedFiles } from '../ToolState'
import { MapFiles, getFilePath } from '../MapFiles'
import SendToGame from './SendToGame'

export const UpdateUnsavedData = action((filePath:string, text:string) => {
  UnsavedFiles[filePath] = text
})

export const CancelUnsavedData = action((tab?:TabType) => {
  if (!tab) { tab = EditorState.activeTab }

  if (tab === 'Field') {
    SendToGame({ method: 'reset_field' })
  }
  
  const filePath = getFilePath(tab)
  if (filePath?.endsWith('.json') && MapFiles.text[filePath]) {
    MapFiles.json[filePath] = JSON.parse(MapFiles.text[filePath])
  }
  
  delete UnsavedFiles[filePath]
  EditorState.editorTrigger = !EditorState.editorTrigger
})

export const GetJsonFileValue = (filePath:string, valuePath:string) => {
  const fileObj = MapFiles.json[filePath]
  let result:JSONValue = fileObj

  const path = valuePath.split('.')
  while (path.length > 0) {
    if (
      typeof result === 'number' ||
      typeof result === 'boolean' ||
      typeof result === 'string'
    ) {
      console.warn('GetJsonFileValue: wrong value path', filePath, valuePath, fileObj, result)
      return null 
    }
    const nextPathPart = path.shift() ?? ''
    
    if (Array.isArray(result)) {
      const idx = parseInt(nextPathPart)
      result = result[idx]
    } else if(result !== null){
      result = result[nextPathPart]
    }
    if (result === undefined) {
      console.warn('GetJsonFileValue: wrong value path', valuePath)
      return null
    }
  }
  
  return result
}

export const AddJsonFileValue = action((
  filePath: string,
  defaultName: string,
  template: any,
  selectItem?: (id:string) => void
) => {
  const fileObj = MapFiles.json[filePath]
  let n = 1
  let newId = 'New ' + defaultName
  while (fileObj[newId]) {
    newId = 'New ' + defaultName + n
    n++
  }
  if(template.type === ''){
    template.type = newId
  }
  fileObj[newId] = template
  UnsavedFiles[filePath] = JSON.stringify(fileObj, null, 2)
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
  
  UnsavedFiles[filePath] = JSON.stringify(fileObj, null, 2)
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

  UnsavedFiles[filePath] = JSON.stringify(fileObj, null, 2)
})

export const ChangeEffectType = action((
  filePath:string, effectPath:string, idx:number, newVal:Effects
) => {
  const effectsArray = GetJsonFileValue(filePath, effectPath) as EffectType[]
  if (!effectsArray) {
    console.warn('ChangeEffectType: effects array', effectsArray)
    return
  }

  const newEffectData = { ...EffectTemplates[newVal] } as JSONObject
  for (const key in newEffectData) {
    if (Array.isArray(newEffectData[key])) {
      newEffectData[key] = []
    }
  }

  const newEffect = { [newVal]: newEffectData }
  effectsArray[idx] = newEffect as EffectType
  UnsavedFiles[filePath] = JSON.stringify(MapFiles.json[filePath], null, 2)
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
      typeof targetObj === 'string'
    ) {
      console.warn('UpdateJsonFileValue: wrong value path', filePath, valuePath, fileObj, targetObj)
      return null
    }

    const nextPathPart = path.shift() ?? ''
    
    if (Array.isArray(targetObj)) {
      const idx = parseInt(nextPathPart)
      targetObj = targetObj[idx]
    } else {
      targetObj = targetObj[nextPathPart] as JSONObject
    }
  }
  const lastPathPart = path.shift() ?? ''
  const oldValue = targetObj[lastPathPart]
  if (oldValue === value) return
  targetObj[lastPathPart] = value
  UnsavedFiles[filePath] = JSON.stringify(fileObj, null, 2)
})
