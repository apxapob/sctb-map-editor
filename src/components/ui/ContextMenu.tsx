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
        style={{ 
          top: Math.min(MenuState.menuY, window.innerHeight - 28 * MenuState.items.length - 10), 
          left: Math.min(MenuState.menuX, window.innerWidth - 120)
        }}
      >
        {MenuState.items.map((i, idx) => i &&
          <div className='context-menu-item' key={idx} onClick={i.callback}>
            {i.title}
          </div>
        )}
      </div>
    </div>
  )
}

export default observer(ContextMenu)
