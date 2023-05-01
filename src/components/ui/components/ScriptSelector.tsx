import React from 'react'
import { Selector } from './Selector'
import { MapFiles, SCRIPTS_PATH } from '../../../state/MapFiles'
import { observer } from 'mobx-react-lite'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'

const ScriptSelector = (
  { filePath, valuePath } : { filePath: string, valuePath: string }
) => {
  const scripts = Object.keys(MapFiles.text)
      .filter(filename => filename.startsWith(SCRIPTS_PATH))
      .map(filename => filename.replace(SCRIPTS_PATH, ''))

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

export default observer(ScriptSelector)
