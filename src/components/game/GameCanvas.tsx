import React, { ReactElement } from 'react'
import './GameCanvas.css'
import { observer } from 'mobx-react-lite'

export const GameCanvasId = 'game_canvas'

const GameCanvas = ():ReactElement => {
  return (
    <iframe id={GameCanvasId} 
      className="Game-canvas" src="/game/index.html" frameBorder="0" 
    />
  )
}

export default observer(GameCanvas)
