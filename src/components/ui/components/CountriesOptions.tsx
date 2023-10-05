import React from 'react'
import { MapFiles } from '../../../state/MapFiles'
import { GetJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'
import { CountryInfo, MapInfo } from '../../../types/types'
import JsonNumberInput from './JsonNumberInput'
import JsonColorSelector from './JsonColorSelector'
  
const CountriesOptions = (
  { filePath, valuePath }:InputProps
) => {
  const observedCountries = GetJsonFileValue(filePath, valuePath) as CountryInfo[]
  const maxPlayers = (MapFiles.json[filePath] as MapInfo).maxPlayers

  while (observedCountries.length !== maxPlayers) {
    if (observedCountries.length > maxPlayers) {
      observedCountries.pop()
    } else {
      observedCountries.push({
        color: 0xffffff,
        minerals: 0,
        mana: 0
      })
    }
  }

  return <div>
    <div className='hflex' style={{ gap: 6, marginTop: 12 }}>
      <span style={{ width: 124 }}>
        Country
      </span>
      <span style={{ width: 60 }}>
        Color
      </span>
      <span style={{ width: 70 }}>
        Minerals
      </span>
      <span style={{ width: 70 }}>
        Mana
      </span>
    </div>
    <div className='vflex' style={{ margin: '6px 0 0 0' }}>
      {observedCountries.map((c, idx) => 
        <div key={idx} className='hflex' style={{ alignItems: "center", gap: 6 }}>
          <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
            <span className='view-input-title'>
              {'Country ' + (idx + 1)}
            </span>
            <JsonColorSelector
              filePath={filePath}
              valuePath={`countries.${idx}.color`}
            />
          </div>
          <JsonNumberInput
            placeholder='Minerals'
            title=""
            filePath={filePath}
            valuePath={`countries.${idx}.minerals`} 
            isInteger={true} 
          />
          <JsonNumberInput
            placeholder='Mana'
            title=""
            filePath={filePath}
            valuePath={`countries.${idx}.mana`} 
            isInteger={true} 
          />
        </div>
      )}
    </div>
  </div>
}

export default observer(CountriesOptions)
