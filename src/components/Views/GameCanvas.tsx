import React, { ReactElement } from 'react'
import './GameCanvas.css'
import { observer } from 'mobx-react-lite'

export const GameCanvasId = 'game_canvas'

export type GameCanvasProps = {
  active: boolean;
  testing: boolean;
}

const GameCanvas = (props:GameCanvasProps):ReactElement => {
  return (
    <iframe id={GameCanvasId} 
      className={`Game-canvas ${props.active ? 'cnv-active' : ''} ${props.testing ? 'cnv-test' : ''}`} 
      src="/game/index.html" frameBorder="0" 
    />
  )
}

export default observer(GameCanvas)
