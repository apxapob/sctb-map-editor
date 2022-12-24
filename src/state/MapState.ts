import { observable } from 'mobx'
import { MapSettingsType } from '../types/types'

export const MapState: {
  mapId: string | null,
  settings: MapSettingsType
} = observable({
  mapId: null,
  settings: {
    units: [],
    buffs: [],
    upgrades: []
  }
})
