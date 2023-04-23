import React, { ReactElement } from 'react'
import { INFO_PATH, MapFiles } from '../../../state/MapFiles'
import { UpdateMapJsonFile } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'
import { MapInfo } from '../../../types/types'
import { toJS } from 'mobx'

type ColorInputProps = {
  value: string;
  title: string;
  setValue: (val:string) => void;
}

const ColorInput = (
  { value, title, setValue }:ColorInputProps
):ReactElement => 
  <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
    <span className='view-input-title'>
      {title}
    </span>
    <input
      type='color'
      onChange={e => setValue(e.target.value.replace('#', '0x'))}
      value={value?.replace('0x', '#')}
    />
  </div>
  
const CountriesColors = (
  { filePath, valuePath, title }:InputProps
) => {
  const observedColors = MapFiles.json[filePath][valuePath] as string[]
  const colors = toJS(observedColors ?? [])
  
  const maxPlayers = (MapFiles.json[INFO_PATH] as MapInfo).maxPlayers

  while (colors.length !== maxPlayers) {
    if (colors.length > maxPlayers) {
      colors.pop()
    } else {
      colors.push('0xffffff')
    }
  }

  return <div>
    {title}
    <div className='vflex' style={{ margin: '6px 0 0 12px' }}>
      {colors.map((color, idx) => 
        <ColorInput
          key={idx}
          title={'Country ' + (idx + 1)}
          value={color}
          setValue={newColor => {
            colors[idx] = newColor
            UpdateMapJsonFile(filePath, valuePath, colors)
          }}
        />
      )}
    </div>
  </div>
}

export default observer(CountriesColors)
