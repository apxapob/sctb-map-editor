import React, { ReactElement } from 'react'
import './GameCanvas.css'
import { observer } from 'mobx-react-lite'
import MapState from '../../state/MapState'

export const GameCanvasId = 'game_canvas'

const GameCanvas = ():ReactElement => {
  console.log('@@@ mapState', MapState.size)

  return (
    <iframe id={GameCanvasId} className="Game-canvas" src="/game/index.html" />
  )
}

export default observer(GameCanvas)
