import { observer } from 'mobx-react-lite'
import React, { ReactElement, useState } from 'react'
import { ClosePanel } from '../../../state/actions/OpenPanel'
import SendMsgToGame from '../../../state/actions/SendMsgToGame'
import './panels.css'

const NewMapPanel = ():ReactElement | null => {
  const [mapSize, setMapSize] = useState(19)
  const [playersCount, setPlayersCount] = useState(6)

  const setSize = (n:number) => setMapSize(
    Math.min(Math.max(n, 11), 39)
  )

  const setPlayers = (n:number) => setPlayersCount(
    Math.min(Math.max(n, 2), 6)
  )

  return (
    <div className="panel" style={{ width: 294 }}>
      <div className="panel-title">New map</div>
      
      <div className='vflex'>
        <div className='hflex'>
          <span style={{ width: '100%', textAlign:'start' }}>
            Map name:&nbsp;
          </span>
          <input></input>
        </div>

        <div className='hflex'>
          <span style={{ width: '100%', textAlign:'start' }}>
            Map id:&nbsp;
          </span>
          <input title='Only latin letters, numbers and character "_" are allowed'></input>
        </div>

        <div className='hflex'>
          <span style={{ width: '100%', textAlign:'start' }}>
            Map size:&nbsp;
          </span>
          <button onClick={() => setSize(mapSize - 2)} >-</button>
          <span style={{ minWidth:60 }} >{mapSize}x{mapSize}</span>
          <button onClick={() => setSize(mapSize + 2)} >+</button>
        </div>

        <div className='hflex'>
          <span style={{ width: '100%', textAlign:'start' }}>
            Players count:&nbsp;
          </span>
          <button onClick={() => setPlayers(playersCount - 1)} >-</button>
          <span style={{ minWidth:60 }} >{playersCount}</span>
          <button onClick={() => setPlayers(playersCount + 1)} >+</button>
        </div>
      </div>

      <button style={{ marginTop: 24 }}
        onClick={() => {
          SendMsgToGame({ 
            method: 'new_map', 
            data:{ playersCount, mapSize } 
          })
          ClosePanel()
      }} >
        Create map
      </button>
    </div>
  )
}

export default observer(NewMapPanel)
