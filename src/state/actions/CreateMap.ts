import { action } from 'mobx'
import { SendToElectron } from '../../utils/messenger'

const CreateMap = ():void => {
  SendToElectron({ command: 'CREATE_MAP' })
}

export default action(CreateMap)
