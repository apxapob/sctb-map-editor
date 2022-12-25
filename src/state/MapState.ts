import { observable } from 'mobx'
import { MapInfo, MapSettingsType } from '../types/types'

export const MapState: {
  mapInfo: MapInfo | null,
  settings: MapSettingsType
} = observable({
  mapInfo: null,
  settings: {
    units: [],
    buffs: [],
    upgrades: []
  }
})
