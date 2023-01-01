import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { changeBuffTurns, changeUnitParam, removeBuff, setBuffTurns, setUnitParam, UnitParamId, UpdateUnitsCountry, UpdateUnitsType } from '../../state/actions/UpdateUnits'
import { INFO_PATH, MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { SelectedUnits } from '../../state/ToolState'
import { BuffDataType, MapInfo, UnitType } from '../../types/types'
import './UnitSelection.css'

const spaceBtwStyle = { justifyContent: 'space-between', gap: 6 }

const UnitSelection = ():ReactElement|null => {
  const selectedUnits = SelectedUnits.data

  const unitsData = MapFiles.json[UNITS_PATH] as {
    [unitId: string]: UnitType
  }
  const unitTypes = React.useMemo(() => Object.values(unitsData).map(u => u.type), [unitsData])

  const mapInfo = MapFiles.json[INFO_PATH] as MapInfo

  if (selectedUnits.length === 0) {
    return null
  }
  
  const mainUnit = selectedUnits[0]
  const typeValue = selectedUnits.find(u => u.type !== mainUnit.type) ? '' : mainUnit.type
  const countryValue = selectedUnits.find(u => u.countryId !== mainUnit.countryId) ? undefined : mainUnit.countryId
  
  const unitColor = mapInfo.countryColors[mainUnit.countryId - 1] || 'white'
  const countryColors = ['0xffffff', ...mapInfo.countryColors]

  const buffs: ( 
    BuffDataType | 'different buffs' | { buffType:string }
  )[] = []

  const maxLen = selectedUnits.reduce(
    (acc, unit) => Math.max(acc, unit.buffs.length), 
    0
  )
  for (let buffIdx = 0; buffIdx < maxLen; buffIdx++) {
    let b:BuffDataType | { buffType:string } = selectedUnits[0].buffs[buffIdx]
    for (let i = 1; i < selectedUnits.length; i++) {
      const b2 = selectedUnits[i].buffs[buffs.length]
      if (!b || !b2 || b.buffType !== b2.buffType) {
        buffs.push('different buffs')
        break
      }
      if ('turnsLeft' in b && b.turnsLeft !== b2.turnsLeft) {
        b = { buffType: b.buffType }
      }
    }
    
    if (buffs.length <= buffIdx) {
      buffs.push(b)
    }
  }

  return <div className='tools-container unit-selection-container vflex' >
    <div className='hflex' style={spaceBtwStyle}>
      Type:
      <select value={typeValue} onChange={e => UpdateUnitsType(e.target.value)}>
        {typeValue === '' &&
        <option value={''} />
          }
        {unitTypes.map(
          (unitType:string) => 
            <option key={unitType} value={unitType}>
              {unitType}
            </option>
        )}
      </select>
    </div>

    <div className='hflex' style={spaceBtwStyle}>
      Country: 
      <select value={countryValue}
        style={{ 
          width: 60,
          backgroundColor: countryValue === undefined ? 'unset' : unitColor.replace('0x', '#') 
        }}
        onChange={e => UpdateUnitsCountry(
          parseInt(e.target.value)
        )}
      >
        {countryValue === undefined &&
          <option value={undefined} style={{ backgroundColor: 'black' }} />
        }
        {countryColors.map(
          (countryColor:string, idx:number) => 
            <option key={countryColor} value={idx} style={{ backgroundColor: countryColor.replace('0x', '#') }}>
              
            </option>
        )}
      </select>
    </div>
    
    <UnitStatChanger title='Attack' param='attack' />
    <UnitStatChanger title='Health' param='hp' />
    <UnitStatChanger title='Range' param='range' />
    <UnitStatChanger title='Speed' param='speed' />
    <UnitStatChanger title='Vision' param='vision' />

    <div className='vflex' style={{ paddingTop: 8, gap: 2 }}>
      Buffs
      <div className='buff-list vflex'>
        {buffs.map(
          (b, idx) => b === 'different buffs' ? b : <BuffChanger idx={idx} key={idx} buff={b} /> 
        )}
      </div>
      
    </div> 
    
  </div>
}

export default observer(UnitSelection)

const UnitStatChanger = observer((props:{
  title: string;
  param: UnitParamId;
}) => {
  const selectedUnits = SelectedUnits.data
  const mainUnit = selectedUnits[0]
  const { param } = props
  const value = selectedUnits.find(u => u.stats[param] !== mainUnit.stats[param]) ? '?' : mainUnit.stats[param]

  return (
    <div className='hflex' style={spaceBtwStyle}>
      {props.title}: 
      <div className='hflex'>
        <button onClick={() => changeUnitParam(param, -1)}>-</button>
        <input onChange={e => setUnitParam(param,
          parseInt(e.target.value)
        )} value={value} className="num-input" />
        <button onClick={() => changeUnitParam(param, 1)}>+</button>
      </div>
    </div>
  )
})

const BuffChanger = observer((props:{
  idx: number;
  buff: BuffDataType | { buffType:string };
}) => {
  const { buff, idx } = props
  return (
    <div className='hflex' style={spaceBtwStyle}>
      <button onClick={() => removeBuff(idx)}>X</button>
      <div style={{ width: '100%', textAlign: 'left' }}>
        {buff.buffType}
      </div>
      
      {'turnsLeft' in buff &&
        <>
          <button onClick={() => changeBuffTurns(idx, -1)}>-</button>
          <input onChange={e => setBuffTurns(idx,
              parseInt(e.target.value)
            )} value={buff.turnsLeft} className="num-input" />
          <button onClick={() => changeBuffTurns(idx, 1)}>+</button>
        </>
      }
      {!('turnsLeft' in buff) &&
        '??? '
      }
      turns
    </div>
  )
})
