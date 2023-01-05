import { action } from 'mobx'
import { SendCommand } from '../../utils/messenger'

const CreateMap = (mapId:string, mapName:string, playersCount:number, mapSize:number):void => {
  SendCommand({ command: 'CREATE_MAP', mapId, mapName, playersCount, mapSize })
}

export default action(CreateMap)
