import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { MapFiles, } from '../../state/MapFiles'
import { EditorState, JsonMode } from '../../state/ToolState'
import { AllTabs, TabType } from '../../types/types'
import GameCanvas from '../Views/GameCanvas'
import EmptyPage from '../ui/EmptyPage'
import JsonEditor from '../ui/JsonEditor'
import PanelsContainer from '../ui/panels/PanelsContainer'
import Tab from '../ui/Tab'
import './App.css'
import ContextMenu from '../ui/ContextMenu'
import FieldView from '../Views/FieldView'
import MapView from '../Views/MapView'
import UnitsView from '../Views/UnitsView'
import ItemsView from '../Views/ItemsView'
import SkillsView from '../Views/SkillsView'
import BuffsView from '../Views/BuffsView'

const Views: Record<TabType, () => ReactElement|null> = {
  Field: FieldView,
  Units: UnitsView,
  Items: ItemsView,
  Skills: SkillsView,
  Buffs: BuffsView,
  Upgrades: JsonEditor,
  Scripts: JsonEditor,
  Map: MapView,
  Texts: JsonEditor,
  Particles: JsonEditor,
}

const App = () => {
  const isLoaded = MapFiles.status === 'Loaded'
  
  const tab = EditorState.activeTab
  const View = Views[tab]
  return (
    <div className="App">
      {!EditorState.mapTesting &&
        <div className='hflex tab-container'>
          {AllTabs.map(
            s => <Tab key={s} selected={tab === s} title={s} />
          )}
        </div>
      }
      <GameCanvas 
        active={ !JsonMode[tab] && (tab === 'Field' || tab === 'Map') } 
        testing={ EditorState.mapTesting } 
      />
      {MapFiles.status === null &&
        <EmptyPage />
      }
      {isLoaded && !EditorState.mapTesting && 
        (JsonMode[tab] ? <JsonEditor /> : <View />)
      }
      <PanelsContainer />
      <ContextMenu />
    </div>
  )
}

export default observer(App)
