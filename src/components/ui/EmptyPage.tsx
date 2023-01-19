import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import CreateMap from '../../state/actions/CreateMap'
import OpenPanel from '../../state/actions/OpenPanel'
import { SendCommand } from '../../utils/messenger'
import './EmptyPage.css'

const EmptyPage = ():ReactElement => {
  return (
    <div className="empty-page">
      <button onClick={CreateMap}>
        New Map
      </button>
      <button onClick={() => SendCommand({ command: 'OPEN_MAP' }) }>
        Open Map
      </button>
    </div>
  )
}

export default observer(EmptyPage)
