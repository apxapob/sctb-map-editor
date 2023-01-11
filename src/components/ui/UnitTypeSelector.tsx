import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import SelectUnitType from '../../state/actions/SelectUnitType'
import { MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { UnitType } from '../../types/types'

const UnitTypeSelector = ():ReactElement => {
  const units = MapFiles.json[UNITS_PATH] as {
    [unitId: string]: UnitType
  }
  
  const unitArray = React.useMemo(() => Object.values(units), [units])

  React.useEffect(() => {
    SelectUnitType(unitArray[0]?.type, false)
  }, [units])

  return (
    <select style={{ width:20 }} className="btnArrow"
      onChange={e => {
        SelectUnitType(e.target.value)
        e.target.blur()
      }}>
      {unitArray.map(
        (u:UnitType) => 
          <option key={u.type} value={u.type}>
            {u.type}
          </option>
      )}
    </select>
  )
}

export default observer(UnitTypeSelector)
