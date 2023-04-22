import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import JsonEditor from '../ui/JsonEditor'
import JsonValueInput from '../ui/components/JsonValueInput'
import { INFO_PATH } from '../../state/MapFiles'
import './View.css'
import ApplyCancelButtons from './ApplyCancelButtons'

const MapView = ():ReactElement => {
  //const mapInfo = useRef(MapFiles.json[INFO_PATH] as MapInfo)
  //mapInfo.current.

  return <div className='view-container'>
    <div className='vflex'>
      <JsonValueInput
        placeholder='Map id'
        title="Map id"
        filePath={INFO_PATH}
        valuePath='mapId'
      />
      <JsonValueInput
        placeholder='Map name'
        title="Map name"
        filePath={INFO_PATH}
        valuePath='name'
      />
      <JsonValueInput
        placeholder='Description'
        title="Description"
        filePath={INFO_PATH}
        valuePath='description'
      />
      <JsonValueInput
        placeholder='Author'
        title="Author"
        filePath={INFO_PATH}
        valuePath='author'
      />
      <ApplyCancelButtons />
    </div>
    <JsonEditor />
  
  </div>
}

export default observer(MapView)
