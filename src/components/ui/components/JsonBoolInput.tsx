import React, { ReactElement } from 'react'
import { MapFiles } from '../../../state/MapFiles'
import { UpdateMapJsonFile } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonValueInput'

const JsonBoolInput = (
  { filePath, valuePath, title, placeholder }:InputProps
):ReactElement => {
  const value = MapFiles.json[filePath][valuePath] as boolean
  return (
    <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
      <span className='view-input-title'>
        {title}
      </span>
      <input
        type='checkbox'
        onChange={e => UpdateMapJsonFile(filePath, valuePath, e.target.checked)}
        checked={value}
        placeholder={placeholder}
      />
    </div>
  )
}

export default observer(JsonBoolInput)
