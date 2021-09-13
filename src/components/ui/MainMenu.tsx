import { observer } from 'mobx-react-lite'
import React, { ReactElement, useState } from 'react'
import OpenPanel from '../../state/actions/OpenPanel'
import RotateMap from '../../state/actions/RotateMap'
import './MainMenu.css'

const MainMenu = ():ReactElement => {
  const [menuOpen, setMenuOpen] = useState(false)
  
  return (
    <div className="menu-container" onMouseLeave={() => setMenuOpen(false)}>
      <span className={menuOpen ? 'selected' : 'menu-item last-item'} onClick={() => setMenuOpen(!menuOpen)}>
        Map
      </span>
      {menuOpen &&
        <React.Fragment>
          <span className="menu-item" onClick={() => OpenPanel('NewMap')} >
            <span>New map</span>
            <span>Ctrl+N</span>
          </span>
          <span className="menu-item" >
            <span>Open map</span>
            <span>Ctrl+O</span>
          </span>
          <span className="menu-item" >
            <span>Save map</span>
            <span>Ctrl+S</span>
          </span>

          <span className="delimiter" />

          <span className="rotate-item" >
            Rotate map&nbsp;
            <span className="menu-item" onClick={() => RotateMap(false)}>⭯Q</span>
            <span className="menu-item last-item" onClick={() => RotateMap(true)}>⭮E</span>
          </span>
        </React.Fragment>
      }
    </div>
  )
}

export default observer(MainMenu)
