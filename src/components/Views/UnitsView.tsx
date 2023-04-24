import React, { ReactElement, useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { UnitStatsType } from '../../types/types'
import JsonEditor from '../ui/JsonEditor'

type UnitsMap = {
  [index: string]: UnitStatsType;
}

const UnitsView = ():ReactElement => {
  const unitsMap = MapFiles.json[UNITS_PATH] as UnitsMap

  const [selectedUnitId, selectUnit] = useState<string|null>(null)

  return <>
    <div className='view-container hflex'>
      <div className='dir-viewer-container'>
        {Object.keys(unitsMap).map(unitId =>
          <div className={`node ${ selectedUnitId === unitId ? 'selected-item' : '' }`}
            key={unitId} 
            onClick={() => selectUnit(unitId)}>
            {unitId}
          </div>
        )}
      </div>
      <div className='json-editor-container'>
        selected unit info: {selectedUnitId}
      </div>
    </div>
    <JsonEditor />
  </>
}

export default observer(UnitsView)
