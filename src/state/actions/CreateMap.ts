import { action } from 'mobx'
import { SendCommand } from '../../utils/messenger'

const CreateMap = ():void => {
  SendCommand({ command: 'CREATE_MAP' })
}

export default action(CreateMap)
