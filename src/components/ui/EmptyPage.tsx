import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import './EmptyPage.css'

const EmptyPage = ():ReactElement => {
  return (
    <div className="empty-page">
      <button >
        New Map
      </button>
      <button >
        Open Map
      </button>
    </div>
  )
}

export default observer(EmptyPage)
