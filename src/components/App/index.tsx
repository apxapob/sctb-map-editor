import React, { ReactElement } from 'react'
import GameCanvas from '../game/GameCanvas'
import Tools from '../ui/Tools'
import './App.css'

const App = ():ReactElement => {
  return (
    <div className="App">
      <GameCanvas />
      <Tools />
    </div>
  )
}

export default App
