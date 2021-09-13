import React, { ReactElement } from 'react'
import GameCanvas from '../game/GameCanvas'
import MainMenu from '../ui/MainMenu'
import PanelsContainer from '../ui/panels/PanelsContainer'
import Tools from '../ui/Tools'
import './App.css'

const App = ():ReactElement => {
  return (
    <div className="App">
      <GameCanvas />
      <Tools />
      <MainMenu />
      <PanelsContainer />
    </div>
  )
}

export default App
