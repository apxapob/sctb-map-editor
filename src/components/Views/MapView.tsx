import React from 'react'
import JsonStringInput from '../ui/components/JsonStringInput'
import { INFO_PATH, MapFiles } from '../../state/MapFiles'
import './View.css'
import JsonNumberInput from '../ui/components/JsonNumberInput'
import CountriesOptions from '../ui/components/CountriesOptions'
import TilesOptions from '../ui/components/TilesOptions'
import JsonScriptsList from '../ui/components/JsonScriptsList'
import { MapInfo } from '../../types/types'
import { observer } from 'mobx-react-lite'
import JsonValueSelector from '../ui/components/JsonValueSelector'

const MapView = () => 
  <div className='view-container hflex map-view' style={{ gap: 30 }}>
    <div className='vflex' style={{ textAlign: "center" }}>
      <h3 style={{ textAlign: "left" }}>
      Map settings
      </h3>
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
      <JsonNumberInput
        placeholder='Min players num'
        title="Min players num"
        filePath={INFO_PATH}
        valuePath='minPlayers'
        isInteger={true}
        min={1}
        max={(MapFiles.json[INFO_PATH] as MapInfo).maxPlayers}
      />
      <JsonNumberInput
        placeholder='Max countries num'
        title="Max countries num"
        filePath={INFO_PATH}
        valuePath='maxPlayers'
        isInteger={true}
        min={(MapFiles.json[INFO_PATH] as MapInfo).minPlayers}
        max={99}
      />
      <JsonValueSelector
        title="Teams"
        values={['disabled', 'fixed', 'configurable']}
        defaultValue="disabled"
        filePath={INFO_PATH}
        valuePath={`teams`}
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
    
    <JsonScriptsList 
      filePath={INFO_PATH} valuePath='mapScripts' title='Map Scripts' 
      tooltip='List of scripts which will be launched at the start of every turn'
    />
    <JsonScriptsList 
      filePath={INFO_PATH} valuePath='aiScripts' title='AI Scripts' 
      tooltip='List of scripts which will be launched before the end of every turn for every AI country'
    />
  </div>

export default observer(MapView)
