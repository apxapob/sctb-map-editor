import React from 'react'
import Tools from '../ui/Tools'
import ObjectSelection from '../ui/ObjectSelection'
import { Selector } from '../ui/components/Selector'
import { observer } from 'mobx-react-lite'
import { MapInfo } from '../../types/types'
import { INFO_PATH, MapFiles } from '../../state/MapFiles'
import { ToolState, TestingSettings } from '../../state/ToolState'
import { ChangeFogOfWarCountry } from '../../state/actions/ChangeTool'
import { ChangePlayersNum } from '../../state/actions/ChangeTestSettings'
import TestMap from '../../state/actions/TestMap'

const FogOfWarSelector = observer(() => {
  const maxPlayers = (MapFiles.json[INFO_PATH] as MapInfo).maxPlayers
  const countries = ['Fog of war disabled']
  for (let i = 1; i <= maxPlayers; i++) {
    countries.push('Country ' + i + ' fog of war')
  }

  const idx = ToolState.fogOfWarCountryId

  return <Selector
    value={countries[idx]}
    style={{ width: 'unset', margin: 0, position: 'absolute', borderRadius: '0 0 6px 0' }}
    items={countries}
    onSelect={newVal => ChangeFogOfWarCountry(countries.indexOf(newVal))}
  />
})

const TestingTool = observer(() => {
  const maxPlayers = (MapFiles.json[INFO_PATH] as MapInfo).maxPlayers
  const players = TestingSettings.players

  return <div className='test-tool vflex'>
    Test map settings
    <div className="hflex gap">
      <button className="tool" onClick={() => ChangePlayersNum(-1)} >-</button>
      {players}/{maxPlayers}
      <button className="tool" onClick={() => ChangePlayersNum(1)} >+</button>
    </div>
    <button className="tool" onClick={TestMap} >Test Map</button>
  </div>
})

const FieldView = () => 
  <>
    <Tools />
    <ObjectSelection />
    <FogOfWarSelector />
    <TestingTool />
  </>

export default FieldView
