import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { getDirPath, getFilePath, MapFiles, } from '../../state/MapFiles'
import { EditorState } from '../../state/ToolState'
import { TabType } from '../../types/types'
import GameCanvas from '../game/GameCanvas'
import DirectoryViewer from '../ui/DirectoryViewer'
import EmptyPage from '../ui/EmptyPage'
import JsonEditor from '../ui/JsonEditor'
import PanelsContainer from '../ui/panels/PanelsContainer'
import Tab from '../ui/Tab'
import Tools from '../ui/Tools'
import UnitSelection from '../ui/UnitSelection'
import './App.css'

const App = ():ReactElement => {
  const tabs:TabType[] = ['Field', 'Map', 'Units', 'Buffs', 'Upgrades', 'Scripts', 'Texts']
  const isLoaded = MapFiles.status === 'Loaded'
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
      {isLoaded && EditorState.activeTab === 'Field' &&
        <>
          <Tools />
          <UnitSelection />
        </>
      }
      <div className='hflex' style={{ alignItems: 'start' }}>
        {isLoaded && (EditorState.activeTab === 'Texts' || EditorState.activeTab === 'Scripts') &&
          <DirectoryViewer path={getDirPath(EditorState.activeTab)} />
        }
        {isLoaded && EditorState.activeTab !== 'Field' &&
          <JsonEditor filePath={getFilePath(EditorState.activeTab)} tab={EditorState.activeTab} />
        }
      </div>
      <PanelsContainer />
    </div>
  )
}

export default observer(App)
