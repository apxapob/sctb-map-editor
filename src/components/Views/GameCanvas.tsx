import React from 'react'
import './GameCanvas.css'
import { observer } from 'mobx-react-lite'
import { EditorState } from '../../state/ToolState'

export const GameCanvasId = 'game_canvas'

const GameCanvas = () => {
  const tab = EditorState.activeTab
  const editMap = tab === 'Field'
  return (
    <iframe id={GameCanvasId} 
      className={`Game-canvas ${editMap ? 'cnv-editor' : ''} ${EditorState.mode !== 'edit' ? 'cnv-game' : ''}`} 
      src="./game/index.html" frameBorder="0" 
    />
  )
}

export default observer(GameCanvas)
