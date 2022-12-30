import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { getFilePath, MapFiles, } from '../../state/MapFiles'
import { EditorState } from '../../state/ToolState'
import { TabType } from '../../types/types'
import GameCanvas from '../game/GameCanvas'
import EmptyPage from '../ui/EmptyPage'
import JsonEditor from '../ui/JsonEditor'
import PanelsContainer from '../ui/panels/PanelsContainer'
import Tab from '../ui/Tab'
import Tools from '../ui/Tools'
import UnitSelection from '../ui/UnitSelection'
import './App.css'

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
      {MapFiles.status === null &&
        <EmptyPage />
      }
      {MapFiles.status === 'Loaded' && EditorState.activeTab === 'Field' &&
        <>
          <Tools />
          <UnitSelection />
        </>
      }
      {MapFiles.status === 'Loaded' && EditorState.activeTab !== 'Field' &&
        <JsonEditor filePath={getFilePath(EditorState.activeTab)} tab={EditorState.activeTab} />
      }
      <PanelsContainer />
    </div>
  )
}

export default observer(App)
