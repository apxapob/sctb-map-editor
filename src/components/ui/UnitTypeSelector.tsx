import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import SelectUnitType from '../../state/actions/SelectUnitType'
import { MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { ToolState } from '../../state/ToolState'
import { UnitType } from '../../types/types'
import './UnitTypeSelector.css'

const UnitTypeSelector = ():ReactElement => {
  const units = MapFiles.json[UNITS_PATH] as {
    [unitId: string]: UnitType
  }
  
  return (
    <div className="unit-selector-container">
      {Object.values(units).map(
        (u:UnitType) => 
          <div key={u.type} 
            className={ToolState.toolUnit === u.type ? 'selectedLabelBtn' : 'labelBtn'}
            onClick={() => SelectUnitType(u.type) }>
            {u.type}
          </div>
      )}
    </div>
  )
}

export default observer(UnitTypeSelector)
