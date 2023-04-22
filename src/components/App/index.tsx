import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { MapFiles, } from '../../state/MapFiles'
import { EditorState } from '../../state/ToolState'
import { TabType } from '../../types/types'
import GameCanvas from '../Views/GameCanvas'
import EmptyPage from '../ui/EmptyPage'
import JsonEditor from '../ui/JsonEditor'
import PanelsContainer from '../ui/panels/PanelsContainer'
import Tab from '../ui/Tab'
import './App.css'
import ContextMenu from '../ui/ContextMenu'
import FieldView from '../Views/FieldView'
import MapView from '../Views/MapView'

const Views: Record<TabType, () => ReactElement|null> = {
  Field: FieldView,
  Units: JsonEditor,
  Items: JsonEditor,
  Skills: JsonEditor,
  Buffs: JsonEditor,
  Upgrades: JsonEditor,
  Scripts: JsonEditor,
  Map: MapView,
  Texts: JsonEditor,
  Particles: JsonEditor,
}

const App = ():ReactElement => {
  const tabs:TabType[] = ['Field', 'Map', 'Units', 'Items', 'Skills', 'Buffs', 'Upgrades', 'Scripts', 'Texts', 'Particles']
  const isLoaded = MapFiles.status === 'Loaded'
  
  const View = Views[EditorState.activeTab]
  return (
    <div className="App">
      {!EditorState.mapTesting &&
        <div className='hflex tab-container'>
          {tabs.map(
            s => <Tab key={s} selected={EditorState.activeTab === s} title={s} />
          )}
        </div>
      }
      <GameCanvas active={ EditorState.activeTab === 'Field' } testing={ EditorState.mapTesting } />
      {MapFiles.status === null &&
        <EmptyPage />
      }
      {isLoaded && !EditorState.mapTesting && <View />}
      <PanelsContainer />
      <ContextMenu />
    </div>
  )
}

export default observer(App)
