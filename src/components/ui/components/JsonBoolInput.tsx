import React from 'react'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'

const JsonBoolInput = (
  { filePath, valuePath, title, placeholder, tooltip }:InputProps
) => {
  const value = GetJsonFileValue(filePath, valuePath) === true
  return (
    <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }} title={tooltip}>
      {title &&
        <span className='view-input-title'>
          {title}
        </span>
      }
      <input
        type='checkbox'
        onChange={e => UpdateJsonFileValue(filePath, valuePath, e.target.checked)}
        checked={value}
        placeholder={placeholder}
      />
    </div>
  )
}

export default observer(JsonBoolInput)
