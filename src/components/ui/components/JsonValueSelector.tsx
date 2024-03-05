import React from 'react'
import { Selector } from './Selector'
import { observer } from 'mobx-react-lite'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'

type JsonValueSelectorProps = { 
  title?: string;
  tooltip?: string;
  values: string[];
  filePath: string; 
  valuePath: string;
  defaultValue?: string;
}

const JsonValueSelector = (
  { values, filePath, valuePath,defaultValue, title, tooltip } : JsonValueSelectorProps
) => {
  const value = GetJsonFileValue(filePath, valuePath) as string

  return <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }} title={tooltip}>
    {title &&
      <span className='view-input-title'>
        {title}
      </span>
    }
    <Selector
      value={value ?? defaultValue}
      style={{ width: 'unset', margin: 0 }}
      items={values}
      onSelect={newVal => UpdateJsonFileValue(
        filePath,
        valuePath,
        newVal
      )}
    />
  </div>
}

export default observer(JsonValueSelector)
