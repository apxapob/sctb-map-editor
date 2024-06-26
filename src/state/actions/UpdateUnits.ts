import { action } from 'mobx'
import { BuffType, ObjectDataType, UnitDataType } from '../../types/types'
import { SelectedObjects } from '../ToolState'
import SendToGame from './SendToGame'

export const isUnit = (o:ObjectDataType) => o?.hasOwnProperty('countryId')
export const isItem = (o:ObjectDataType) => o?.hasOwnProperty('unpickable')

const UpdateObjects = ():void => {
  SendToGame({
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

export const SetObjectDirection = action((dir:number) => {
  SelectedObjects.data.forEach(obj => { obj.dir = dir })
  UpdateObjects()
})

export const SetUnitsHP = action((hp:number) => {
  SelectedObjects.data.forEach(u => {
    if (!isUnit(u)) return
    (u as UnitDataType).hp = hp
  })
  UpdateObjects()
})

export const setBuffTurns = action((idx:number, value:number) => {
  if (Number.isNaN(value)) return
  SelectedObjects.data.forEach(
    u => u.buffs[idx].turns = Math.max(-1, value)
  )
  UpdateObjects()
})
export const removeBuff = action((idx:number) => {
  SelectedObjects.data.forEach(
    u => u.buffs.splice(idx, 1)
  )
  UpdateObjects()
})
export const addBuff = action((buff:BuffType) => {
  SelectedObjects.data.forEach(
    u => u.buffs.push(buff)
  )
  UpdateObjects()
})
