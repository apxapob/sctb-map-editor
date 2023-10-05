import React from 'react'
import { GetJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import { InputProps } from './JsonStringInput'
import { TileTypeInfo } from '../../../types/types'
import JsonNumberInput from './JsonNumberInput'
import JsonColorSelector from './JsonColorSelector'
import { AddMapInfoTile, RemoveTileType } from '../../../state/actions/TileActions'
  
const TilesOptions = (
  { filePath, valuePath }:InputProps
) => {
  const tiles = GetJsonFileValue(filePath, valuePath) as TileTypeInfo[]
  
  return <div>
    <div className='hflex' style={{ gap: 6, marginTop: 12 }}>
      <span style={{ width: 160 }}>
        Images
      </span>
      <span style={{ width: 60 }}>
        Color
      </span>
      <span style={{ width: 70 }}>
        Alpha
      </span>
    </div>
    <div className='vflex' style={{ margin: '6px 0 0 0' }}>
      {tiles.map((tile, idx) => 
        <div key={idx} className='hflex' style={{ alignItems: "center", gap: 6 }}>
          <span className='view-input-title'>
            {tile.image_h} {tile.image_v}
          </span>
          <JsonColorSelector
            filePath={filePath}
            valuePath={`tiles.${idx}.color`}
          />
          <JsonNumberInput
            placeholder='Alpha'
            title=""
            filePath={filePath}
            valuePath={`tiles.${idx}.alpha`} 
            isInteger={false}
            min={0}
            max={1} 
          />
          {tiles.length > 1 &&
            <button onClick={() => RemoveTileType(idx)}>
              ✗
            </button>
          }
        </div>
      )}
      <button className='tool' onClick={AddMapInfoTile}>
        Add
      </button>
    </div>
  </div>
}

export default observer(TilesOptions)
