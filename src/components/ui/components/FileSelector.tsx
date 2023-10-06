import React from 'react'
import { Selector } from './Selector'
import { MapFiles } from '../../../state/MapFiles'
import { observer } from 'mobx-react-lite'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'

export type FileType = 'text' | 'binary' | 'json' 

const FileSelector = (
  { sourcePath, filePath, valuePath, fileType } : { sourcePath:string, filePath: string, valuePath: string, fileType?:FileType }
) => {
  const files:{ [filename: string]: any; } = MapFiles[fileType || 'text']

  const items = Object.keys(files)
      .filter(filename => filename.startsWith(sourcePath))
      .map(filename => filename.replace(sourcePath, ''))

  const value = GetJsonFileValue(filePath, valuePath) as string
  return <Selector
    value={value}
    style={{ width: 'unset', margin: 0 }}
    items={items}
    onSelect={newVal => UpdateJsonFileValue(
      filePath,
      valuePath,
      newVal
    )}
  />
}

export default observer(FileSelector)
