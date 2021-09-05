import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import SelectUnitType from '../../state/actions/SelectUnitType'
import { MapState } from '../../state/MapState'
import { ToolState } from '../../state/ToolState'
import { UnitStatsType } from '../../types/types'
import './UnitTypeSelector.css'

const UnitTypeSelector = ():ReactElement => {
  return (
    <div className="unit-selector-container">
      {MapState.settings.units.map(
        (u:UnitStatsType) => 
          <div key={u.unit_type} 
            className={ToolState.toolUnit === u.unit_type ? 'selectedLabelBtn' : 'labelBtn'}
            onClick={() => SelectUnitType(u.unit_type) }>
            {u.unit_type}
          </div>
      )}
    </div>
  )
}

export default observer(UnitTypeSelector)
