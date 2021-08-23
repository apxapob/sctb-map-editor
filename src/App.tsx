import React, { ReactElement } from 'react'
import './App.css'
import GameCanvas from './components/GameCanvas'

const App = ():ReactElement => {
  return (
    <div className="App">
      <GameCanvas />
    </div>
  )
}

export default App
