import { observer } from 'mobx-react-lite'
import React, { ChangeEvent, ReactElement, useState } from 'react'
import CreateMap from '../../../state/actions/CreateMap'
import { ClosePanel } from '../../../state/actions/OpenPanel'
import './panels.css'

const NewMapPanel = ():ReactElement | null => {
  const [mapSize, setMapSize] = useState(19)
  const [playersCount, setPlayersCount] = useState(6)

  const [mapName, setMapName] = useState('')
  const [mapId, setMapId] = useState('')

  const setSize = (n:number) => setMapSize(
    Math.min(Math.max(n, 11), 39)
  )

  const setPlayers = (n:number) => setPlayersCount(
    Math.min(Math.max(n, 2), 6)
  )

  const updateMapId = (e:ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replaceAll(/[^a-z_0-9]+/gi, '')
    setMapId(val)
  }

  return (
    <div className="panel" style={{ width: 294 }}>
      <div className="panel-title">New map</div>
      
      <div className='vflex'>
        <div className='hflex'>
          <span style={{ width: '100%', textAlign:'start' }}>
            Map name:&nbsp;
          </span>
          <input onChange={e => setMapName(e.target.value)} value={mapName} />
        </div>

        <div className='hflex'>
          <span style={{ width: '100%', textAlign:'start' }}>
            Map id:&nbsp;
          </span>
          <input title='Only latin letters, numbers and character "_" are allowed'
            onChange={updateMapId} value={mapId} />
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
          CreateMap(mapId, mapName, playersCount, mapSize)
          ClosePanel()
      }} >
        Create map
      </button>
    </div>
  )
}

export default observer(NewMapPanel)
