import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import SelectUnitType from '../../state/actions/SelectUnitType'
import { MapState } from '../../state/MapState'
import { ToolState } from '../../state/ToolState'
import { UnitType } from '../../types/types'
import './UnitTypeSelector.css'

const UnitTypeSelector = ():ReactElement => {
  return (
    <div className="unit-selector-container">
      {MapState.settings.units.map(
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
