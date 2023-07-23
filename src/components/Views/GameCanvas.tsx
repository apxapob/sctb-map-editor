import React from 'react'
import './GameCanvas.css'
import { observer } from 'mobx-react-lite'
import { EditorState, JsonMode } from '../../state/ToolState'

export const GameCanvasId = 'game_canvas'

const GameCanvas = () => {
  const playMode = EditorState.playMode
  const tab = EditorState.activeTab
  const editMap = !JsonMode[tab] && (tab === 'Field' || tab === 'Map')
  return (
    <iframe id={GameCanvasId} 
      className={`Game-canvas ${editMap ? 'cnv-editor' : ''} ${playMode ? 'cnv-game' : ''}`} 
      src="/game/index.html" frameBorder="0" 
    />
  )
}

export default observer(GameCanvas)
