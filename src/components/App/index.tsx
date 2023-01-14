import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { SelectScriptFile, SelectLangFile, SelectParticlesFile } from '../../state/actions/OpenFileTree'
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

const fileSelectors: {
  [key: string]: (path:string) => void;
} = {
  'Scripts': SelectScriptFile, 
  'Texts': SelectLangFile, 
  'Particles': SelectParticlesFile
}

const App = ():ReactElement => {
  const tabs:TabType[] = ['Field', 'Map', 'Units', 'Skills', 'Buffs', 'Upgrades', 'Scripts', 'Texts', 'Particles']
  const isLoaded = MapFiles.status === 'Loaded'
  const showDirViewer = EditorState.activeTab === 'Texts' || EditorState.activeTab === 'Scripts' || EditorState.activeTab === 'Particles'
  
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
        {isLoaded && showDirViewer &&
          <DirectoryViewer 
            path={getDirPath(EditorState.activeTab)} 
            fileSelector={fileSelectors[EditorState.activeTab]}
          />
        }
        {isLoaded && EditorState.activeTab !== 'Field' &&
          <JsonEditor
            filePath={getFilePath(EditorState.activeTab)} 
            tab={EditorState.activeTab} 
          />
        }
      </div>
      <PanelsContainer />
    </div>
  )
}

export default observer(App)
