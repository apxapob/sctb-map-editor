import React, { createRoot } from 'react-dom/client'
import App from './components/App'
import './index.css'
import { Initialize } from './state/actions/Initialization'

Initialize()

const container = document.getElementById('root')
if (container !== null) {
  const root = createRoot(container)
  root.render(<App />)
} else {
  console.error('No root element.')
}

const times:number[] = []
const fpsContainer = document.getElementById('fps')

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now()
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift()
    }
    times.push(now)
    if (fpsContainer) { fpsContainer.textContent = 'fps: ' + times.length }
    refreshLoop()
  })
}

refreshLoop()
