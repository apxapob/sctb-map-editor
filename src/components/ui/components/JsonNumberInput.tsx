import React, { ReactElement } from 'react'
import { MapFiles } from '../../../state/MapFiles'
import { UpdateMapJsonFile } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonValueInput'

export type NumberInputProps = InputProps & {
  isInteger: boolean;
  min?: number;
  max?: number;
}

const JsonNumberInput = (
  { filePath, valuePath, title, placeholder, isInteger, min, max }:NumberInputProps
):ReactElement => {
  const value = MapFiles.json[filePath][valuePath] as number
  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    let newVal = (isInteger ? parseInt(e.target.value) : parseFloat(e.target.value)) || 0
    if (min !== undefined) newVal = Math.max(min, newVal)
    if (max !== undefined) newVal = Math.min(max, newVal)
    UpdateMapJsonFile(
      filePath,
      valuePath,
      newVal
    )
  }
  return (
    <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
      <span className='view-input-title'>
        {title}
      </span>
      <input
        type="number" 
        inputMode='decimal'
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  )
}

export default observer(JsonNumberInput)
