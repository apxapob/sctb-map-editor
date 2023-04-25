import React, { ReactElement } from 'react'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'

export type InputProps = {
  filePath: string;
  valuePath: string;
  title: string;
  placeholder?: string;
}

const JsonStringInput = (
  { filePath, valuePath, title, placeholder }:InputProps
):ReactElement => {
  const value = GetJsonFileValue(filePath, valuePath)
  return (
    <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
      <span className='view-input-title'>
        {title}
      </span>
      <input
        className='view-input'
        onChange={e => UpdateJsonFileValue(filePath, valuePath, e.target.value)}
        value={value?.toString()}
        placeholder={placeholder}
      />
    </div>
  )
}

export default observer(JsonStringInput)
