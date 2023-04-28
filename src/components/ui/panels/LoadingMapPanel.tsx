import { observer } from 'mobx-react-lite'
import React from 'react'
import { ClosePanel } from '../../../state/actions/OpenPanel'
import { MapFiles } from '../../../state/MapFiles'
import './panels.css'

const LoadingMapPanel = () => {
  const percent = Math.floor(100 * MapFiles.progress)
  return (
    <div className="panel fullsize vflex" style={{ alignItems: 'center' }}>
      <div className="panel-title">Loading map</div>
      loading {MapFiles.lastLoadedFile}
      <br />
      <progress style={{ width: '90%' }} value={percent} max="100"> {percent}% </progress>
      <br />
      {MapFiles.status === 'Error' &&
        <>
          <div style={{ color: 'red' }}>
            Error: {MapFiles.error}
          </div>
          <br />
          <button onClick={() => ClosePanel()}>
            Close
          </button>
        </>
      }
    </div>
  )
}

export default observer(LoadingMapPanel)
