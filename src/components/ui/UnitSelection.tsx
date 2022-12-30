import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { changeUnitParam, setUnitParam, UnitParamId, UpdateUnitsCountry, UpdateUnitsType } from '../../state/actions/UpdateUnits'
import { INFO_PATH, MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { SelectedUnits } from '../../state/ToolState'
import { MapInfo, UnitType } from '../../types/types'
import './UnitSelection.css'

const spaceBtwStyle = { justifyContent: 'space-between', gap: 6 }

const UnitSelection = ():ReactElement|null => {
  const selectedUnits = SelectedUnits.data

  const unitsData = MapFiles.json[UNITS_PATH] as {
    [unitId: string]: UnitType
  }
  const unitTypes = React.useMemo(() => Object.values(unitsData).map(u => u.type), [unitsData])

  const mapInfo = MapFiles.json[INFO_PATH] as MapInfo

  /*TODO: add unit properties for editing:
  buffs:[],
  dir: number;
  */
  if (selectedUnits.length === 0) {
    return null
  }
  
  const mainUnit = selectedUnits[0]
  const typeValue = selectedUnits.find(u => u.type !== mainUnit.type) ? '' : mainUnit.type
  const countryValue = selectedUnits.find(u => u.countryId !== mainUnit.countryId) ? undefined : mainUnit.countryId
  
  const unitColor = mapInfo.countryColors[mainUnit.countryId - 1] || 'white'
  const countryColors = ['0xffffff', ...mapInfo.countryColors]

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
