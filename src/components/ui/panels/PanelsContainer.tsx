import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { ClosePanel } from '../../../state/actions/OpenPanel'
import { ToolState } from '../../../state/ToolState'
import NewMapPanel from './NewMapPanel'
import './panels.css'

const panels: Record<string, () => ReactElement|null> = {
  'NewMap': NewMapPanel
}

const PanelsContainer = ():ReactElement | null => {
  const { activePanel } = ToolState
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
