import React, { ReactElement, useEffect } from 'react'
import './GameCanvas.css'

const gameCanvasId = 'game_canvas'

const GameCanvas = ():ReactElement => {
  useEffect(() => {
    const canv = document.getElementById(gameCanvasId) as HTMLCanvasElement
    if (!canv || !canv.getContext) { return }
    const ctx = canv.getContext('2d')
    if (!ctx) { return }

    ctx.fillRect(25,25,100,100)
    ctx.clearRect(45,45,60,60)
    ctx.strokeRect(50,50,50,50)
  })

  return (
    <canvas id={gameCanvasId} className="Game-canvas">
      
    </canvas>
  )
}

export default GameCanvas
