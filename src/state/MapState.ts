import { observable } from 'mobx'
import { MapSettingsType } from '../types/types'

export const MapState: {
  settings: MapSettingsType
} = observable({
  settings: {
    units: []
  }
})
