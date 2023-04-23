import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import JsonEditor from '../ui/JsonEditor'
import JsonStringInput from '../ui/components/JsonStringInput'
import { INFO_PATH } from '../../state/MapFiles'
import './View.css'
import ApplyCancelButtons from './ApplyCancelButtons'
import JsonNumberInput from '../ui/components/JsonNumberInput'
import JsonBoolInput from '../ui/components/JsonBoolInput'
import CountriesColors from '../ui/components/CountriesColors'

const MapView = ():ReactElement => {
  //const mapInfo = useRef(MapFiles.json[INFO_PATH] as MapInfo)
  //mapInfo.current.

  return <div className='view-container'>
    <div className='vflex'>
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
      <CountriesColors
        title="Countries colors:"
        filePath={INFO_PATH}
        valuePath='countryColors'
      />
      <ApplyCancelButtons />
    </div>
  </div>
}

export default observer(MapView)
