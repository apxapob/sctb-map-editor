import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { MapState } from '../../state/MapState'
import GameCanvas from '../game/GameCanvas'
import EmptyPage from '../ui/EmptyPage'
import PanelsContainer from '../ui/panels/PanelsContainer'
import Tools from '../ui/Tools'
import './App.css'

const App = ():ReactElement => {
  if (MapState.mapInfo === null) {
    return (
      <div className="App">
        <EmptyPage />
        <PanelsContainer />
      </div>
    )
  }
  
  return (
    <div className="App">
      <GameCanvas />
      <Tools />
      <PanelsContainer />
    </div>
  )
}

export default observer(App)
