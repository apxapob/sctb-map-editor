/* eslint-disable @typescript-eslint/ban-ts-comment */
import { action } from 'mobx'
import { ItemDataType, UnitDataType } from '../../types/types'
import { SelectedObjects } from '../ToolState'
// @ts-ignore
import { throttle } from '../../utils/debounce'

export const OnSelectUnits = throttle(action(
  (ids:(ItemDataType | UnitDataType)[]) => {
    SelectedObjects.data = ids
  }
))
