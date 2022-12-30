import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import ChangeTool from '../../state/actions/ChangeTool'
import { ToolState } from '../../state/ToolState'
import './Tools.css'
import UnitTypeSelector from './UnitTypeSelector'

const Tools = ():ReactElement => {
  const { radius, tool, toolUnit } = ToolState

  return (
    <div className="tools-container">
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
        
        <button className={`tool ${tool === 'CreateTiles' ? 'selectedBtn' : ''}`}
          onClick={() => ChangeTool({ tool: 'CreateTiles' })} >Create Tiles</button>
        <button className={`tool ${tool === 'CreateManaTiles' ? 'selectedBtn' : ''}`}
          onClick={() => ChangeTool({ tool: 'CreateManaTiles' })} >Create Mana Tiles</button>
        <button className={`tool ${tool === 'DeleteTiles' ? 'selectedBtn' : ''}`}
          onClick={() => ChangeTool({ tool: 'DeleteTiles' })} >Delete Tiles</button>
          
        <span style={{ paddingTop: 8 }}>
          Units
        </span>
          
        <button className={`tool ${tool === 'SelectUnits' ? 'selectedBtn' : ''}`}
          onClick={() => ChangeTool({ tool: 'SelectUnits' })} >Select</button>
        <div className='hflex' style={{ width: '100%', position:'relative' }}>
          <button className={`${tool === 'CreateUnits' ? 'selectedBtn' : ''} btnWithArrow`}
            onClick={() => ChangeTool({ tool: 'CreateUnits' })} >{toolUnit}</button>
          <UnitTypeSelector />
        </div>
        <button className={`tool ${tool === 'DeleteUnits' ? 'selectedBtn' : ''}`}
            onClick={() => ChangeTool({ tool: 'DeleteUnits' })} >Delete units</button>
      </div>
    </div>
  )
}

export default observer(Tools)
