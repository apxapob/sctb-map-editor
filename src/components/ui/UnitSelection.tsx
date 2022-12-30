import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { UpdateUnitsCountry, UpdateUnitsType } from '../../state/actions/UpdateUnits'
import { INFO_PATH, MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { SelectedUnits } from '../../state/ToolState'
import { MapInfo, UnitType } from '../../types/types'
import './UnitSelection.css'

const UnitSelection = ():ReactElement|null => {
  const selectedUnits = SelectedUnits.data

  const unitsData = MapFiles.json[UNITS_PATH] as {
    [unitId: string]: UnitType
  }
  const unitTypes = React.useMemo(() => Object.values(unitsData).map(u => u.type), [unitsData])

  const mapInfo = MapFiles.json[INFO_PATH] as MapInfo

  /*
  buffs:[],
  dir: number;
  stats: UnitStatsType;
  pos: HexCoords;
  */
  if (selectedUnits.length === 0) {
    return null
  }

  const mainUnit = selectedUnits[0]
  const unitColor = mapInfo.countryColors[mainUnit.countryId - 1] || 'white'
  const countryColors = ['0xffffff', ...mapInfo.countryColors]

  return <div className='tools-container unit-selection-container vflex' >
    <div className='hflex' style={{ justifyContent: 'space-between' }}>
      Type:
      <select value={mainUnit.type} onChange={e => UpdateUnitsType(e.target.value)}>
        {unitTypes.map(
          (unitType:string) => 
            <option key={unitType} value={unitType}>
              {unitType}
            </option>
        )}
      </select>
    </div>

    <div className='hflex' style={{ justifyContent: 'space-between' }}>
      Country: 
      <select value={mainUnit.countryId}
        style={{ backgroundColor: unitColor.replace('0x', '#') }}
        onChange={e => UpdateUnitsCountry(
          parseInt(e.target.value)
        )}>
        {countryColors.map(
          (countryColor:string, idx:number) => 
            <option key={countryColor} value={idx} style={{ backgroundColor: countryColor.replace('0x', '#') }}>
              
            </option>
        )}
      </select>
    </div>
  </div>
}

export default observer(UnitSelection)
