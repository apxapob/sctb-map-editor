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
  SelectedUnits.data.forEach(u => u.type = newType)
  UpdateUnits()
})

export const UpdateUnitsCountry = action((newCountryId:number) => {
  console.log('!!! update country', newCountryId)
  SelectedUnits.data.forEach(u => u.countryId = newCountryId)
  UpdateUnits()
})
