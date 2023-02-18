import { action } from 'mobx'
import { BuffDataType, ObjectDataType, UnitDataType, UnitStatsType } from '../../types/types'
import { SelectedObjects } from '../ToolState'
import SendMsgToGame from './SendMsgToGame'

export const isUnit = (o:ObjectDataType) => o?.hasOwnProperty('countryId')
export const isItem = (o:ObjectDataType) => o?.hasOwnProperty('unpickable')

const UpdateObjects = ():void => {
  SendMsgToGame({
    method: 'update_objects',
    data: SelectedObjects.data
  })
}

export const UpdateItemsType = action((newType:string) => {
  if (!newType) return
  SelectedObjects.data.forEach(i => {
    if (!isItem(i)) return
    i.type = newType
  })
  UpdateObjects()
})

export const UpdateUnitsType = action((newType:string) => {
  if (!newType) return
  SelectedObjects.data.forEach(u => {
    if (!isUnit(u)) return
    u.type = newType
  })
  UpdateObjects()
})

export const UpdateUnitsCountry = action((newCountryId:number) => {
  if (Number.isNaN(newCountryId)) return
  SelectedObjects.data.forEach(u => {
    if (!isUnit(u)) return
    (u as UnitDataType).countryId = newCountryId
  })
  UpdateObjects()
})

export type UnitParamId = keyof UnitStatsType

export const changeUnitParam = action((param:UnitParamId, delta:number) => {
  if (Number.isNaN(delta)) return
  SelectedObjects.data.forEach(
    u => {
      if (!isUnit(u)) return
      u = u as UnitDataType
      u.stats[param] = Math.max(0, u.stats[param] + delta)
    }
  )
  UpdateObjects()
})
export const setUnitParam = action((param:UnitParamId, value:number) => {
  if (Number.isNaN(value)) return
  SelectedObjects.data.forEach(
    u => {
      if (!isUnit(u)) return
      (u as UnitDataType).stats[param] = Math.max(0, value)
    }
  )
  UpdateObjects()
})

export const changeBuffTurns = action((idx:number, delta:number) => {
  if (Number.isNaN(delta)) return
  SelectedObjects.data.forEach(
    u => u.buffs[idx].turnsLeft += delta
  )
  UpdateObjects()
})
export const setBuffTurns = action((idx:number, value:number) => {
  if (Number.isNaN(value)) return
  SelectedObjects.data.forEach(
    u => u.buffs[idx].turnsLeft = value
  )
  UpdateObjects()
})
export const removeBuff = action((idx:number) => {
  SelectedObjects.data.forEach(
    u => u.buffs.splice(idx, 1)
  )
  UpdateObjects()
})
export const addBuff = action((buff:BuffDataType) => {
  SelectedObjects.data.forEach(
    u => u.buffs.push(buff)
  )
  UpdateObjects()
})
