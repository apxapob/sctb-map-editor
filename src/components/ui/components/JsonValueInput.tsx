import React, { ReactElement } from 'react'
import { MapFiles } from '../../../state/MapFiles'
import { UpdateMapJsonFile } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'

export type InputProps = {
  filePath: string;
  valuePath: string;
  title: string;
  placeholder?: string;
}

const JsonValueInput = (
  { filePath, valuePath, title, placeholder }:InputProps
):ReactElement => {
  const value = MapFiles.json[filePath][valuePath]
  //
  return (
    <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
      <span className='view-input-title'>
        {title}
      </span>
      <input
        className='view-input'
        onChange={e => UpdateMapJsonFile(filePath, valuePath, e.target.value)}
        value={value?.toString()}
        placeholder={placeholder}
      />
    </div>
  )
}

export default observer(JsonValueInput)
