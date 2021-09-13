import { observer } from 'mobx-react-lite'
import React, { ReactElement, useState } from 'react'
import { ClosePanel } from '../../../state/actions/OpenPanel'
import SendMsgToGame from '../../../state/actions/SendMsgToGame'
import './panels.css'

const NewMapPanel = ():ReactElement | null => {
  const [mapSize, setMapSize] = useState(19)
  const [playersCount, setPlayersCount] = useState(6)

  return (
    <div className="panel">
      <div className="panel-title">New map</div>
      
      <div style={{
          display:'flex',
          justifyContent: 'center',
          alignItems: 'center',
          whiteSpace: 'nowrap'
        }}>
        <span style={{ width: '100%', textAlign:'start' }}>
          Map size:&nbsp;
        </span>
        <span className="btn" onClick={() => setMapSize(mapSize - 2)} >-</span>
        <span style={{ minWidth:60 }} >{mapSize}x{mapSize}</span>
        <span className="btn" onClick={() => setMapSize(mapSize + 2)} >+</span>
      </div>

      <div style={{
          display:'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8px 0 24px 0',
          whiteSpace: 'nowrap'
        }}>
        <span style={{ width: '100%', textAlign:'start' }}>
          Players count:&nbsp;
        </span>
        <span className="btn" onClick={() => setPlayersCount(playersCount - 1)} >-</span>
        <span style={{ minWidth:60 }} >{playersCount}</span>
        <span className="btn" onClick={() => setPlayersCount(playersCount + 1)} >+</span>
      </div>

      <span className="btn tool" onClick={() => {
        SendMsgToGame({ 
          method: 'new_map', 
          data:{ playersCount, mapSize } 
        })
        ClosePanel()
      }} >
        Create map
      </span>
    </div>
  )
}

export default observer(NewMapPanel)
