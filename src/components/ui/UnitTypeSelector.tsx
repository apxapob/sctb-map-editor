import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import SelectUnitType from '../../state/actions/SelectUnitType'
import { MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { UnitType } from '../../types/types'
import { Selector } from './components/Selector'

const UnitTypeSelector = ():ReactElement => {
  const units = MapFiles.json[UNITS_PATH] as {
    [unitId: string]: UnitType
  }
  
  const unitArray = React.useMemo(() => Object.values(units), [units])

  React.useEffect(() => {
    SelectUnitType(unitArray[0]?.type, false)
  }, [units])

  return <Selector items={unitArray.map(u => u.type)} onSelect={SelectUnitType} />
}

export default observer(UnitTypeSelector)
