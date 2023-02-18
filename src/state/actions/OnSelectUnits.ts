import { action } from 'mobx'
import { ItemDataType, UnitDataType } from '../../types/types'
import { SelectedObjects } from '../ToolState'

export const OnSelectUnits = action(
  (ids:(ItemDataType | UnitDataType)[]) => {
    SelectedObjects.data = ids
  }
)
