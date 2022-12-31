import { action } from 'mobx'
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

export type UnitParamId = 'speed' | 'range' | 'vision' | 'hp' | 'attack'
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
  console.log('!!! changeBuffParam', idx, delta)
})
export const setBuffTurns = action((idx:number, value:number) => {
  console.log('!!! setBuffTurns', idx, value)
})
export const removeBuff = action((idx:number) => {
  console.log('!!! removeBuff', idx)
})
