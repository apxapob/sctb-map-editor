import React from 'react'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'

const JsonBoolInput = (
  { filePath, valuePath, title, placeholder }:InputProps
) => {
  const value = GetJsonFileValue(filePath, valuePath) as boolean
  return (
    <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
      <span className='view-input-title'>
        {title}
      </span>
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
