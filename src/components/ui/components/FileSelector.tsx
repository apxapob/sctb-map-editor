import React from 'react'
import { Selector } from './Selector'
import { MapFiles } from '../../../state/MapFiles'
import { observer } from 'mobx-react-lite'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'

export type FileType = 'text' | 'binary' | 'json' 

type FileSelectorProps = { 
  filesSourcePath:string; 
  filePath: string; 
  valuePath: string; 
  fileType?: FileType;
  width?: string | number;
}

const FileSelector = (
  { filesSourcePath, filePath, valuePath, fileType, width } : FileSelectorProps
) => {
  const files:{ [filename: string]: any; } = MapFiles[fileType || 'text']

  const items = Object.keys(files)
    .filter(filename => filename.startsWith(filesSourcePath))
    .map(filename => filename.replace(filesSourcePath, ''))
  
  const value = GetJsonFileValue(filePath, valuePath) as string ?? ""
  if(value){
    items.unshift("")
  }
  return <Selector
    value={value}
    style={{ width: width ?? 'unset', margin: 0 }}
    items={items}
    onSelect={newVal => UpdateJsonFileValue(filePath, valuePath, newVal)}
  />
}

export default observer(FileSelector)
