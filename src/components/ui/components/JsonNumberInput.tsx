import React from 'react'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'

export type NumberInputProps = InputProps & {
  isInteger: boolean;
  min?: number;
  max?: number;
  nullable?: boolean;
}

const JsonNumberInput = (
  { filePath, valuePath, title, placeholder, isInteger, min, max, tooltip, nullable }:NumberInputProps
) => {
  const value = GetJsonFileValue(filePath, valuePath) as number
  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    
    let newVal: number|null = isInteger ? parseInt(e.target.value) : parseFloat(e.target.value)
    if(isNaN(newVal) || newVal === undefined || newVal === null) newVal = nullable ? null : 0
    
    if (min !== undefined) newVal = Math.max(min, newVal ?? 0)
    if (max !== undefined) newVal = Math.min(max, newVal ?? 0)
    UpdateJsonFileValue(
      filePath,
      valuePath,
      newVal
    )
  }
  return (
    <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }} title={tooltip}>
      {title &&
        <span className='view-input-title'>
          {title}
        </span>
      }
      <input
        type='number'
        inputMode='decimal'
        onChange={onChange}
        value={value ?? ""}
        placeholder={placeholder}
      />
    </div>
  )
}

export default observer(JsonNumberInput)
