import React, { ReactElement } from 'react'
import './GameCanvas.css'
import { observer } from 'mobx-react-lite'
import MapState from '../../state/MapState'
import SendMsgToGame from '../../state/actions/SendMsgToGame'

export const GameCanvasId = 'game_canvas'

const GameCanvas = ():ReactElement => {
  console.log('@@@ mapState', MapState.size)

  return (
    <iframe id={GameCanvasId} 
      className="Game-canvas" src="/game/index.html" frameBorder="0" 
    />
  )
}

export default observer(GameCanvas)

const pressedKeys: { [key: string]: string } = {}
window.onkeyup = e => { delete pressedKeys[e.code] }
window.onkeydown = e => { pressedKeys[e.code] = 'pressed' }

const drawFrame = () => {
  window.requestAnimationFrame(drawFrame)

  SendMsgToGame({ method: 'keys_pressed', data: pressedKeys })
  for (const i in pressedKeys) {
    pressedKeys[i] = 'down'
  }
}
drawFrame()
