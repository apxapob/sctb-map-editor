import React, { ReactElement } from 'react'
import GameCanvas from '../game/GameCanvas'
import MainMenu from '../ui/MainMenu'
import Tools from '../ui/Tools'
import './App.css'

const App = ():ReactElement => {
  return (
    <div className="App">
      <GameCanvas />
      <Tools />
      <MainMenu />
    </div>
  )
}

export default App
