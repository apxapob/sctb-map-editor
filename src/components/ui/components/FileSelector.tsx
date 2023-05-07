import React from 'react'
import { Selector } from './Selector'
import { MapFiles } from '../../../state/MapFiles'
import { observer } from 'mobx-react-lite'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'

const FileSelector = (
  { sourcePath, filePath, valuePath } : { sourcePath:string, filePath: string, valuePath: string }
) => {
  const scripts = Object.keys(MapFiles.text)
      .filter(filename => filename.startsWith(sourcePath))
      .map(filename => filename.replace(sourcePath, ''))

  const script = GetJsonFileValue(filePath, valuePath) as string

  return <Selector
    value={script}
    style={{ width: 'unset', margin: 0 }}
    items={scripts}
    onSelect={newVal => UpdateJsonFileValue(
      filePath,
      valuePath,
      newVal
    )}
  />
}

export default observer(FileSelector)
