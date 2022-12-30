import { action } from 'mobx'
import { UnitDataType } from '../../types/types'
import { SelectedUnits } from '../ToolState'

export const OnSelectUnits = action(
  (unitIds:UnitDataType[]) => {
    SelectedUnits.data = unitIds
  }
)
