import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import OpenPanel from '../../state/actions/OpenPanel'
import './EmptyPage.css'

const EmptyPage = ():ReactElement => {
  return (
    <div className="empty-page">
      <button onClick={() => OpenPanel('NewMap')}>
        New Map
      </button>
      <button >
        Open Map
      </button>
    </div>
  )
}

export default observer(EmptyPage)
