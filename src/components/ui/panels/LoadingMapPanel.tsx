import { observer } from 'mobx-react-lite'
import React, { ReactElement, useState } from 'react'
import { MapFiles } from '../../../state/MapFiles'
import './panels.css'

const LoadingMapPanel = ():ReactElement | null => {
  const percent = Math.floor(100 * MapFiles.progress)
  return (
    <div className="panel fullsize vflex">
      <div className="panel-title">Loading map</div>
      loading {MapFiles.lastLoadedFile}
      <br />
      <progress style={{ width: '90%' }} value={percent} max="100"> {percent}% </progress>
    </div>
  )
}

export default observer(LoadingMapPanel)
