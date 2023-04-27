import { observer } from 'mobx-react-lite'
import React from 'react'
import { ClosePanel } from '../../../state/actions/OpenPanel'
import { EditorState } from '../../../state/ToolState'
import { PanelType } from '../../../types/types'
import LoadingMapPanel from './LoadingMapPanel'
import './panels.css'

const panels: Record<PanelType, () => ReactElement|null> = {
  'MapSettings': () => null,
  'LoadingMap': LoadingMapPanel
}

const PanelsContainer = ():ReactElement | null => {
  const { activePanel } = EditorState
  if (!activePanel) { return null }
  
  const Panel = panels[activePanel]
  if (!Panel) {
    return (
      <div className="panels-container" onClick={ClosePanel}>
        {activePanel}
      </div>
    )
  }

  return (
    <div className="panels-container" onClick={ClosePanel}>
      <div className="panel-container" onClick={e => e.stopPropagation()}>
        <Panel />
      </div>
    </div>
  )
}

export default observer(PanelsContainer)
