import { action } from 'mobx'
import { TabType } from '../../types/types'
import { TabsState } from '../ToolState'

export const UpdateUnsavedData = action((tab:TabType, text:string|null) => {
  TabsState[tab] = text
})
