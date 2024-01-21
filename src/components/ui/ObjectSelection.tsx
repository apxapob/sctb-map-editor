import { observer } from 'mobx-react-lite'
import React from 'react'
import SendToGame from '../../state/actions/SendToGame'
import { addBuff, isItem, isUnit, removeBuff, SetObjectDirection, setBuffTurns, SetUnitsHP, UpdateItemsType, UpdateUnitsCountry, UpdateUnitsType } from '../../state/actions/UpdateUnits'
import { BUFFS_PATH, INFO_PATH, ITEMS_PATH, MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { SelectedObjects } from '../../state/ToolState'
import { BuffType, ItemType, MapInfo, UnitDataType, UnitsMap } from '../../types/types'
import './UnitSelection.css'
import CountryColorSelector from './components/CountryColorSelector'
import { toJS } from 'mobx'
import { SpriteRotator } from './components/SpriteViewer'

const ObjectSelection = () => {
  const selectedObjects = SelectedObjects.data

  if (selectedObjects.length === 0) {
    return null
  }
  
  const selectedUnits:UnitDataType[] = selectedObjects.filter(isUnit) as UnitDataType[]

  const mainObj = selectedObjects[0]
  const typeValue = selectedObjects.find(u => u.type !== mainObj.type) ? '' : mainObj.type
  
  const mainUnit = selectedUnits[0]
  const countryValue = mainUnit && (selectedUnits.find(u => u.countryId !== mainUnit.countryId) ? undefined : mainUnit.countryId)
  
  const buffs: (
    BuffType | 'different buffs' | { type: string }
  )[] = []

  const maxLen = selectedObjects.reduce(
    (acc, unit) => Math.max(acc, unit.buffs.length), 
    0
  )
  for (let buffIdx = 0; buffIdx < maxLen; buffIdx++) {
    let b:BuffType | { type: string } = selectedObjects[0].buffs[buffIdx]
    for (let i = 1; i < selectedObjects.length; i++) {
      const b2 = selectedObjects[i].buffs[buffs.length]
      if (!b || !b2 || b.type !== b2.type) {
        buffs.push('different buffs')
        break
      }
      if ('turns' in b && b.turns !== b2.turns) {
        b = { type: b.type }
      }
    }
    
    if (buffs.length <= buffIdx) {
      buffs.push(b)
    }
  }

  let commonHP = null
  if(isUnit(mainObj)){
    commonHP = mainUnit.hp 
    for(let i=0; i < selectedUnits.length; i++){
      if(selectedUnits[i].hp !== commonHP){
        commonHP = null
        break
      }
    }
  }
   

  return <div className='tools-container unit-selection-container vflex' >
    <div className='hflex gapped'>
      Type:
      {isUnit(mainObj) && <UnitsTypeChanger typeValue={typeValue} />}
      {isItem(mainObj) && <ItemsTypeChanger typeValue={typeValue} />}
    </div>

    {isUnit(mainObj) && commonHP !== null &&
      <div className='hflex gapped'>
        HP:
        <input 
          onChange={ e => SetUnitsHP(parseInt(e.target.value)) }
          value={commonHP} 
          type='number'
        />
      </div>
    }

    {selectedUnits.length > 0 &&
      <div className='hflex gapped'>
        Country:
        <CountryColorSelector countryId={countryValue} onChange={UpdateUnitsCountry} />
      </div>
    }

    {isUnit(mainObj) &&
      <div className='hflex gapped'>
        Direction:
        <SpriteRotator setDirection={SetObjectDirection} direction={mainObj.dir}/>
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
        () => SendToGame({ method: 'reset_objects' })
      }>
        Reset to default
      </button>
    </div> 
    
  </div>
}

export default observer(ObjectSelection)

const BuffChanger = observer((props:{
  idx: number;
  buff: BuffType | { type: string };
}) => {
  const { buff, idx } = props
  return (
    <div className='hflex gapped'>
      <button onClick={() => removeBuff(idx)}>X</button>
      <div style={{ width: '100%', textAlign: 'left' }}>
        {buff.type}
      </div>
      
      {'turns' in buff &&
        <input 
          onChange={ e => setBuffTurns(idx, parseInt(e.target.value)) }
          value={buff.turns} 
          type='number' 
        />
      }
      {!('turns' in buff) &&
        '??? '
      }
      turns
    </div>
  )
})

const UnitsTypeChanger = observer((
  { typeValue }: { typeValue:string }
) => {
  const unitsData = MapFiles.json[UNITS_PATH] as UnitsMap
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
          () => addBuff(buffsData[selectedBuff])
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
