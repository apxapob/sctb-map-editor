import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { MapFiles, } from '../../state/MapFiles'
import { EditorState, JsonMode } from '../../state/ToolState'
import { AllTabs, TabType } from '../../types/types'
import GameCanvas from '../Views/GameCanvas'
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
import UpgradesView from '../Views/UpgradesView'

const Views: Record<TabType, () => ReactElement|null> = {
  Field: FieldView,
  Units: UnitsView,
  Items: ItemsView,
  Skills: SkillsView,
  Buffs: BuffsView,
  Upgrades: UpgradesView,
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
      {isLoaded && EditorState.mode === 'edit' &&
        <div className='hflex tab-container'>
          {AllTabs.map(
            s => <Tab key={s} selected={tab === s} title={s} />
          )}
        </div>
      }
      <GameCanvas />
      {isLoaded && EditorState.mode === 'edit' && 
        (JsonMode[tab] ? <JsonEditor /> : <View />)
      }
      <PanelsContainer />
      <ContextMenu />
    </div>
  )
}

export default observer(App)
