import React, { ReactElement } from 'react'
import GameCanvas from '../game/GameCanvas'
import './App.css'

const App = ():ReactElement => {
  return (
    <div className="App">
      <GameCanvas />
    </div>
  )
}

export default App
