import { observer } from 'mobx-react-lite'
import React from 'react'
import ChangeTool, { ChangeFieldSize } from '../../state/actions/ChangeTool'
import { ToolState } from '../../state/ToolState'
import ItemTypeSelector from './ItemTypeSelector'
import './Tools.css'
import UnitTypeSelector from './UnitTypeSelector'
import { FIELD_PATH, MapFiles } from '../../state/MapFiles'
import CountryColorSelector from './components/CountryColorSelector'
import TileTypeSelector from './components/TileTypeSelector'

const Tools = () => {
  const { radius, tool, toolUnit, toolItem } = ToolState
  const fieldSize = MapFiles.json[FIELD_PATH].size as number

  return (
    <div className="tools-container">
      <div>
        Field size
        <div style={{
          display:'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 4
        }}>
          <button className="tool" onClick={() => ChangeFieldSize(fieldSize - 2)} >-</button>
          <span style={{ width:'100%', padding: '0 2px' }} >{fieldSize}</span>
          <button className="tool" onClick={() => ChangeFieldSize(fieldSize + 2)} >+</button>
        </div>
      </div>
      <div>
        Tool radius 
        <div style={{
          display:'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 4
        }}>
          <button className="tool" onClick={() => ChangeTool({ radius: radius - 1 })} >-</button>
          <span style={{ width:'100%', padding: '0 2px' }} >{radius}</span>
          <button className="tool" onClick={() => ChangeTool({ radius: radius + 1 })} >+</button>
        </div>
        
      </div>
      <div style={{ paddingTop: 16 }} className="vflex">
        <span className='hflex' style={{ width: '100%', gap: 6 }}>
          <button className={`tool ${tool === 'LandUp' ? 'selectedBtn' : ''}`}
            onClick={() => ChangeTool({ tool: 'LandUp' })} >↑</button>
          Land 
          <button className={`tool ${tool === 'LandDown' ? 'selectedBtn' : ''}`}
            onClick={() => ChangeTool({ tool: 'LandDown' })} >↓</button>
        </span>
        
        <div className='hflex' style={{ width: '100%', alignItems:'center' }}>
          <button className={`tool ${tool === 'CreateTiles' ? 'selectedBtn' : ''}`}
            onClick={() => ChangeTool({ tool: 'CreateTiles' })} >Create Tiles</button>
          <TileTypeSelector />
        </div>
        <button className={`tool ${tool === 'DeleteTiles' ? 'selectedBtn' : ''}`}
          onClick={() => ChangeTool({ tool: 'DeleteTiles' })} >Delete Tiles</button>
          
        <span style={{ paddingTop: 8 }}>
          Units
        </span>
          
        <div className='hflex' style={{ width: '100%', alignItems:'center' }}>
          <button 
            className={`${tool === 'CreateUnits' ? 'selectedBtn' : ''} btnWithArrow`}
            onClick={() => ChangeTool({ tool: 'CreateUnits' })} 
          >
            {toolUnit}
          </button>
          <UnitTypeSelector />
          <CountryColorSelector countryId={ToolState.countryId} onChange={id => ChangeTool({ countryId: id })} />
        </div>

        <span style={{ paddingTop: 8 }}>
          Items
        </span>
          
        <div className='hflex' style={{ width: '100%', alignItems:'center' }}>
          <button 
            className={`${tool === 'CreateItems' ? 'selectedBtn' : ''} btnWithArrow`}
            onClick={() => ChangeTool({ tool: 'CreateItems' })} 
          >
            {toolItem}
          </button>
          <ItemTypeSelector />
        </div>
        
        <button 
          className={`tool ${tool === 'Select' ? 'selectedBtn' : ''}`}
          onClick={() => ChangeTool({ tool: 'Select' })} 
        >
          Select
        </button>
        
        <button className={`tool ${tool === 'Delete' ? 'selectedBtn' : ''}`}
            onClick={() => ChangeTool({ tool: 'Delete' })} >Delete objects</button>
      </div>
    </div>
  )
}

export default observer(Tools)
