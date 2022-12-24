import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import OpenPanel from '../../state/actions/OpenPanel'
import { SendCommand } from '../../utils/messenger'
import './EmptyPage.css'

const EmptyPage = ():ReactElement => {
  return (
    <div className="empty-page">
      <button onClick={() => OpenPanel('NewMap')}>
        New Map
      </button>
      <button onClick={() => SendCommand({ command: 'OPEN_MAP' }) }>
        Open Map
      </button>
    </div>
  )
}

export default observer(EmptyPage)
