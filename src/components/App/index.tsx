import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { MapState } from '../../state/MapState'
import { EditorState } from '../../state/ToolState'
import { TabType } from '../../types/types'
import GameCanvas from '../game/GameCanvas'
import EmptyPage from '../ui/EmptyPage'
import JsonEditor from '../ui/JsonEditor'
import PanelsContainer from '../ui/panels/PanelsContainer'
import Tab from '../ui/Tab'
import Tools from '../ui/Tools'
import './App.css'

export const getFilePath = (tab:TabType) => {
  switch (tab) {
    case 'Buffs':
      return 'buffs.json'
    case 'Units':
      return 'units.json'
    case 'Map':
      return 'info.json'
    case 'Upgrades':
      return 'upgrades.json'
  }
  return ''
}

const App = ():ReactElement => {
  const tabs:TabType[] = ['Field', 'Units', 'Buffs', 'Upgrades', 'Scripts', 'Map']
  return (
    <div className="App">
      <div className='hflex tab-container'>
        {tabs.map(
          s => <Tab key={s} selected={EditorState.activeTab === s} title={s} />
        )}
      </div>
      <GameCanvas active={ EditorState.activeTab === 'Field' } />
      {MapState.mapInfo === null &&
        <EmptyPage />
      }
      {MapState.mapInfo !== null && EditorState.activeTab === 'Field' &&
        <Tools />
      }
      {MapState.mapInfo !== null && EditorState.activeTab !== 'Field' &&
        <JsonEditor filePath={getFilePath(EditorState.activeTab)} tab={EditorState.activeTab} />
      }
      <PanelsContainer />
    </div>
  )
}

export default observer(App)
