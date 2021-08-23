import React, { ReactElement, useEffect } from 'react'
import { GameMessage } from '../../Types/types'
import './GameCanvas.css'

const gameCanvasId = 'game_canvas'

const SendMsgToGame = (msg:GameMessage) => {
  const gameIframe = document.getElementById(gameCanvasId) as HTMLIFrameElement
    
  console.log('@@@ send msg to game')
  gameIframe?.contentWindow?.postMessage(JSON.stringify(msg), '*')
}

const GameCanvas = ():ReactElement => {
  useEffect(() => {
    window.onmessage = event => {
      console.log('@@@ Message received:', event.data)
      SendMsgToGame({
        method: 'init_map_editor'
      })
    }
  })

  return (
    <iframe id={gameCanvasId} className="Game-canvas" src="/game/index.html" />
  )
}

export default GameCanvas
