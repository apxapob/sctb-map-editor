import React from 'react'
import { Selector } from './Selector'
import { observer } from 'mobx-react-lite'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'

type JsonValueSelectorProps = { 
  values: string[];
  filePath: string; 
  valuePath: string;
  defaultValue?: string;
}

const JsonValueSelector = (
  { values, filePath, valuePath,defaultValue } : JsonValueSelectorProps
) => {
  const value = GetJsonFileValue(filePath, valuePath) as string

  return <Selector
    value={value ?? defaultValue}
    style={{ width: 'unset', margin: 0 }}
    items={values}
    onSelect={newVal => UpdateJsonFileValue(
      filePath,
      valuePath,
      newVal
    )}
  />
}

export default observer(JsonValueSelector)
