import { action } from 'mobx'
import { BuffDataType, UnitStatsType } from '../../types/types'
import { SelectedUnits } from '../ToolState'
import SendMsgToGame from './SendMsgToGame'

const UpdateUnits = ():void => {
  SendMsgToGame({
    method: 'update_units',
    data: SelectedUnits.data
  })
}

export const UpdateUnitsType = action((newType:string) => {
  if (!newType) return
  SelectedUnits.data.forEach(u => {
    u.type = newType
  })
  UpdateUnits()
})

export const UpdateUnitsCountry = action((newCountryId:number) => {
  if (Number.isNaN(newCountryId)) return
  SelectedUnits.data.forEach(u => u.countryId = newCountryId)
  UpdateUnits()
})

export type UnitParamId = keyof UnitStatsType

export const changeUnitParam = action((param:UnitParamId, delta:number) => {
  if (Number.isNaN(delta)) return
  SelectedUnits.data.forEach(
    u => u.stats[param] = Math.max(0, u.stats[param] + delta)
  )
  UpdateUnits()
})
export const setUnitParam = action((param:UnitParamId, value:number) => {
  if (Number.isNaN(value)) return
  SelectedUnits.data.forEach(
    u => u.stats[param] = Math.max(0, value)
  )
  UpdateUnits()
})

export const changeBuffTurns = action((idx:number, delta:number) => {
  if (Number.isNaN(delta)) return
  SelectedUnits.data.forEach(
    u => u.buffs[idx].turnsLeft += delta
  )
  UpdateUnits()
})
export const setBuffTurns = action((idx:number, value:number) => {
  if (Number.isNaN(value)) return
  SelectedUnits.data.forEach(
    u => u.buffs[idx].turnsLeft = value
  )
  UpdateUnits()
})
export const removeBuff = action((idx:number) => {
  SelectedUnits.data.forEach(
    u => u.buffs.splice(idx, 1)
  )
  UpdateUnits()
})
export const addBuff = action((buff:BuffDataType) => {
  SelectedUnits.data.forEach(
    u => u.buffs.push(buff)
  )
  UpdateUnits()
})
