import React from 'react'
import JsonStringInput from '../ui/components/JsonStringInput'
import { INFO_PATH } from '../../state/MapFiles'
import './View.css'
import JsonNumberInput from '../ui/components/JsonNumberInput'
import JsonBoolInput from '../ui/components/JsonBoolInput'
import CountriesOptions from '../ui/components/CountriesOptions'
import TilesOptions from '../ui/components/TilesOptions'

const MapView = () => 
  <div className='view-container hflex map-view'>
    <div className='vflex' style={{ width: 380 }}>
      <JsonStringInput
        placeholder='Map id'
        title="Map id"
        filePath={INFO_PATH}
        valuePath='mapId'
      />
      <JsonStringInput
        placeholder='Map name'
        title="Map name"
        filePath={INFO_PATH}
        valuePath='name'
      />
      <JsonStringInput
        placeholder='Description'
        title="Description"
        filePath={INFO_PATH}
        valuePath='description'
      />
      <JsonStringInput
        placeholder='Author'
        title="Author"
        filePath={INFO_PATH}
        valuePath='author'
      />
      <JsonNumberInput
        placeholder='Version'
        title="Version"
        filePath={INFO_PATH}
        valuePath='version'
        isInteger={false}
        min={0}
      />
      <JsonBoolInput
        placeholder='Singleplayer'
        title="Singleplayer"
        filePath={INFO_PATH}
        valuePath='singlePlayer'
      />
      <JsonNumberInput
        placeholder='Max players'
        title="Max players"
        filePath={INFO_PATH}
        valuePath='maxPlayers'
        isInteger={true}
        min={1}
        max={99}
      />
      <CountriesOptions
        filePath={INFO_PATH}
        valuePath='countries'
      />
      <TilesOptions
        filePath={INFO_PATH}
        valuePath='tiles'
      />
    </div>
  </div>

export default MapView
