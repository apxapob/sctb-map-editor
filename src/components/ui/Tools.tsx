import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import ChangeTool from '../../state/actions/ChangeTool'
import { ToolState } from '../../state/MapState'
import './Tools.css'

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
          padding:'4px 0 16px 0'
        }}>
          <span className="radius-btn" onClick={() => ChangeTool({ radius: radius - 1 })} >-</span>
          <span style={{ width:'100%', padding: '0 2px' }} >{radius}</span>
          <span className="radius-btn" onClick={() => ChangeTool({ radius: radius + 1 })} >+</span>
        </div>
        
      </div>
      <div>
        Tool
        <div style={{
          padding: '4px 0px 16px 0px',
          display: 'flex',
          gap: 8,
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span className="radius-btn" 
            style={{ backgroundColor: tool === 'LandUp' ? '#ddd' : 'unset' }}
            onClick={() => ChangeTool({ tool: 'LandUp' })} >Land Up</span>
          <span className="radius-btn" 
            style={{ backgroundColor: tool === 'LandDown' ? '#ddd' : 'unset' }}
            onClick={() => ChangeTool({ tool: 'LandDown' })} >Land Down</span>
          <span className="radius-btn" 
            style={{ backgroundColor: tool === 'DeleteTiles' ? '#ddd' : 'unset' }}
            onClick={() => ChangeTool({ tool: 'DeleteTiles' })} >Delete Tiles</span>
          <span className="radius-btn" 
            style={{ backgroundColor: tool === 'CreateTiles' ? '#ddd' : 'unset' }}
            onClick={() => ChangeTool({ tool: 'CreateTiles' })} >Create Tiles</span>
          <span className="radius-btn" 
            style={{ backgroundColor: tool === 'CreateManaTiles' ? '#ddd' : 'unset' }}
            onClick={() => ChangeTool({ tool: 'CreateManaTiles' })} >Create Mana Tiles</span>
          <span className="radius-btn" 
            style={{ backgroundColor: tool === 'CreateUnits' ? '#ddd' : 'unset' }}
            onClick={() => ChangeTool({ tool: 'CreateUnits' })} >Create Units</span>
          <span className="radius-btn" 
            style={{ backgroundColor: tool === 'DeleteUnits' ? '#ddd' : 'unset' }}
            onClick={() => ChangeTool({ tool: 'DeleteUnits' })} >Delete Units</span>
          <span className="radius-btn" 
            style={{ backgroundColor: tool === 'SelectUnits' ? '#ddd' : 'unset' }}
            onClick={() => ChangeTool({ tool: 'SelectUnits' })} >Select Units</span>
        </div>
      </div>
      <div>
        {toolUnit}
      </div>
    </div>
  )
}

export default observer(Tools)
