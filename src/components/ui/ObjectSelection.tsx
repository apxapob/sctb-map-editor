import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import SendMsgToGame from '../../state/actions/SendMsgToGame'
import { addBuff, changeBuffTurns, isItem, isUnit, removeBuff, setBuffTurns, UpdateItemsType, UpdateUnitsCountry, UpdateUnitsType } from '../../state/actions/UpdateUnits'
import { BUFFS_PATH, INFO_PATH, ITEMS_PATH, MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { SelectedObjects } from '../../state/ToolState'
import { BuffDataType, BuffType, ItemType, MapInfo, UnitDataType, UnitType } from '../../types/types'
import './UnitSelection.css'

const ObjectSelection = ():ReactElement|null => {
  const selectedObjects = SelectedObjects.data
  const mapInfo = MapFiles.json[INFO_PATH] as MapInfo

  if (selectedObjects.length === 0) {
    return null
  }

  const selectedUnits:UnitDataType[] = selectedObjects.filter(isUnit) as UnitDataType[]

  const mainObj = selectedObjects[0]
  const typeValue = selectedObjects.find(u => u.type !== mainObj.type) ? '' : mainObj.type
  
  const mainUnit = selectedUnits[0]
  const countryValue = mainUnit && (selectedUnits.find(u => u.countryId !== mainUnit.countryId) ? undefined : mainUnit.countryId)
  
  const unitColor = mainUnit && (mapInfo.countryColors[mainUnit.countryId - 1] || 'white')
  const countryColors = ['0xffffff', ...mapInfo.countryColors]

  const buffs: ( 
    BuffDataType | 'different buffs' | { buffType:string }
  )[] = []

  const maxLen = selectedObjects.reduce(
    (acc, unit) => Math.max(acc, unit.buffs.length), 
    0
  )
  for (let buffIdx = 0; buffIdx < maxLen; buffIdx++) {
    let b:BuffDataType | { buffType:string } = selectedObjects[0].buffs[buffIdx]
    for (let i = 1; i < selectedObjects.length; i++) {
      const b2 = selectedObjects[i].buffs[buffs.length]
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
    <div className='hflex gapped'>
      Type:
      {isUnit(mainObj) &&
        <UnitsTypeChanger typeValue={typeValue} />
      }
      {isItem(mainObj) &&
        <ItemsTypeChanger typeValue={typeValue} />
      }
      
    </div>

    {selectedUnits.length > 0 &&
      <div className='hflex gapped'>
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
    }
    
    <div className='vflex' style={{ paddingTop: 10 }}>
      Buffs
      <div className='buff-list'>
        {buffs.map(
          (b, idx) => b === 'different buffs' 
            ? <div key={idx}>{b}</div>
            : <BuffChanger idx={idx} key={idx} buff={b} />
        )}
      </div>
      <BuffAdder />
      <button onClick={
        () => SendMsgToGame({ method: 'reset_units_buffs' })
      }>
        Set default buffs
      </button>
    </div> 
    
  </div>
}

export default observer(ObjectSelection)

/*
    <UnitStatChanger title='Attack' param='attack' />
    <UnitStatChanger title='Health' param='maxHp' />
    <UnitStatChanger title='Range' param='range' />
    <UnitStatChanger title='Speed' param='speed' />
    <UnitStatChanger title='Vision' param='vision' />
    <UnitStatChanger title='Flying' param='flying' />
    <UnitStatChanger title='Detector' param='detector' />
    <UnitStatChanger title='Invisible' param='invisible' />

const UnitStatChanger = observer((props:{
  title: string;
  param: UnitParamId;
}) => {
  const selectedUnits = SelectedUnits.data
  const mainUnit = selectedUnits[0]
  const { param } = props
  const value = selectedUnits.find(u => u.stats[param] !== mainUnit.stats[param]) ? '?' : mainUnit.stats[param]

  return (
    <div className='hflex gapped'>
      {props.title}: 
      <div className='hflex gapped'>
        <button onClick={() => changeUnitParam(param, -1)}>-</button>
        <input onChange={e => setUnitParam(param,
          parseInt(e.target.value)
        )} value={value} className="num-input" />
        <button onClick={() => changeUnitParam(param, 1)}>+</button>
      </div>
    </div>
  )
})*/

const BuffChanger = observer((props:{
  idx: number;
  buff: BuffDataType | { buffType:string };
}) => {
  const { buff, idx } = props
  return (
    <div className='hflex gapped'>
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

const UnitsTypeChanger = observer((
  { typeValue }: { typeValue:string }
) => {
  const unitsData = MapFiles.json[UNITS_PATH] as { [unitId: string]: UnitType }
  const unitTypes = React.useMemo(() => Object.values(unitsData).map(u => u.type), [unitsData])

  return (
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
  )
})

const ItemsTypeChanger = observer((
  { typeValue }: { typeValue:string }
) => {
  const itemsData = MapFiles.json[ITEMS_PATH] as { [itemId: string]: ItemType }
  const itemTypes = React.useMemo(() => Object.values(itemsData).map(i => i.type), [itemsData])

  return (
    <select value={typeValue} onChange={e => UpdateItemsType(e.target.value)}>
      {typeValue === '' &&
        <option value={''} />
      }
      {itemTypes.map(
        (itemType:string) => 
          <option key={itemType} value={itemType}>
            {itemType}
          </option>
      )}
    </select>
  )
})

const BuffAdder = observer(() => {
  const buffsData = MapFiles.json[BUFFS_PATH] as {
    [buffId: string]: BuffType
  }
  const buffTypes = React.useMemo(() => Object.values(buffsData).map(b => b.type), [buffsData])

  const [selectedBuff, setSelectedBuff] = React.useState('')

  React.useEffect(() => {
    if (buffTypes.length > 0)setSelectedBuff(buffTypes[0])
  }, [buffsData])

  return (
    <div className='hflex' style={{ width: '100%', alignItems:'center' }}>
      <button className='btnWithArrow' 
        onClick={
          () => addBuff({ buffType: selectedBuff, turnsLeft: buffsData[selectedBuff].turns })
        }>
        Add {selectedBuff}
      </button>
      <select style={{ width:20 }} className="btnArrow"
        onChange={e => setSelectedBuff(e.target.value)}>
        {buffTypes.map(
          buffType => 
            <option key={buffType} value={buffType}>
              {buffType}
            </option>
        )}
      </select>
    </div>
  )
})
