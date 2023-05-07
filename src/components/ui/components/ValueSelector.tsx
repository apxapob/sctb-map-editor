import React from 'react'
import { Selector } from './Selector'
import { observer } from 'mobx-react-lite'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'

const ValueSelector = (
  { values, filePath, valuePath } : { values: string[], filePath: string, valuePath: string }
) => {
  const value = GetJsonFileValue(filePath, valuePath) as string

  return <Selector
    value={value}
    style={{ width: 'unset', margin: 0 }}
    items={values}
    onSelect={newVal => UpdateJsonFileValue(
      filePath,
      valuePath,
      newVal
    )}
  />
}

export default observer(ValueSelector)
