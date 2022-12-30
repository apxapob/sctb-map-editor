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
