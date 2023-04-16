import './ContextMenu.css'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { MenuState } from '../../state/MenuState'
import { HideMenu } from '../../state/actions/ShowMenu'

const ContextMenu = () => {
  if (MenuState.items.length === 0) {
    return null
  }

  return (
    <div className='context-menu-back' onClick={() => HideMenu()}>
      <div 
        className='context-menu-container'
        style={{ top: MenuState.menuY, left: MenuState.menuX }}
      >
        {MenuState.items.map((i, idx) => 
          <div className='context-menu-item' key={idx} onClick={i.callback}>
            {i.title}
          </div>
        )}
      </div>
    </div>
  )
}

export default observer(ContextMenu)
