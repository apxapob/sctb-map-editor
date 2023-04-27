import { observer } from 'mobx-react-lite'
import React from 'react'
import SelectUnitType from '../../state/actions/SelectUnitType'
import { MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { Selector } from './components/Selector'
import { UnitsMap } from '../../types/types'

const UnitTypeSelector = () => {
  const units = MapFiles.json[UNITS_PATH] as UnitsMap
  
  const unitArray = React.useMemo(() => Object.values(units), [units])

  React.useEffect(() => {
    SelectUnitType(unitArray[0]?.type, false)
  }, [units])

  return <Selector items={unitArray.map(u => u.type)} onSelect={SelectUnitType} />
}

export default observer(UnitTypeSelector)
