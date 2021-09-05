import { observer } from 'mobx-react-lite'
import React, { ReactElement, useState } from 'react'
import ChangeTool from '../../state/actions/ChangeTool'
import { ToolState } from '../../state/ToolState'
import './Tools.css'
import UnitTypeSelector from './UnitTypeSelector'

const Tools = ():ReactElement => {
  const { radius, tool, toolUnit } = ToolState

  const [ unitSelection, setUnitSelection ] = useState(false)

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
          <span className="btn tool" onClick={() => ChangeTool({ radius: radius - 1 })} >-</span>
          <span style={{ width:'100%', padding: '0 2px' }} >{radius}</span>
          <span className="btn tool" onClick={() => ChangeTool({ radius: radius + 1 })} >+</span>
        </div>
        
      </div>
      <div style={{
          display: 'flex',
          gap: 8,
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <span style={{ paddingTop: 16 }}>
          Tool
        </span>
        <span className={`tool ${tool === 'SelectUnits' ? 'selectedBtn' : 'btn'}`}
            onClick={() => ChangeTool({ tool: 'SelectUnits' })} >Selection</span>
        <span className={`tool ${tool === 'LandUp' ? 'selectedBtn' : 'btn'}`}
            onClick={() => ChangeTool({ tool: 'LandUp' })} >Land Up</span>
        <span className={`tool ${tool === 'LandDown' ? 'selectedBtn' : 'btn'}`}
            onClick={() => ChangeTool({ tool: 'LandDown' })} >Land Down</span>
        <span className={`tool ${tool === 'DeleteTiles' ? 'selectedBtn' : 'btn'}`}
            onClick={() => ChangeTool({ tool: 'DeleteTiles' })} >Delete Tiles</span>
        <span className={`tool ${tool === 'CreateTiles' ? 'selectedBtn' : 'btn'}`}
            onClick={() => ChangeTool({ tool: 'CreateTiles' })} >Create Tiles</span>
        <span className={`tool ${tool === 'CreateManaTiles' ? 'selectedBtn' : 'btn'}`}
            onClick={() => ChangeTool({ tool: 'CreateManaTiles' })} >Create Mana Tiles</span>
          
        <span style={{ paddingTop: 8 }}>
          Create units
        </span>
          
        <div 
          style={{
            position: 'relative',
            display:'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
          }}>
          <span className={`${tool === 'CreateUnits' ? 'selectedBtn' : 'btn'}`}
            onClick={() => ChangeTool({ tool: 'CreateUnits' })}
            style={{
              width: '100%',
              padding: '2px 6px',
              borderRadius: '6px 0 0 6px'
            }}>{toolUnit}</span>
          <span className={`${unitSelection ? 'selectedBtn' : 'btn'}`} 
            onClick={()=>setUnitSelection(!unitSelection)}
            style={{
              padding: '0 6px',
              borderLeftWidth: 0,
              borderRadius: '0 6px 6px 0'
            }}>&rarr;</span>
          {unitSelection &&
            <span style={{
              position:'absolute',
              zIndex: 2,
              right: -16,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16, height: 32
            }}>
              <svg width='16' height='32' viewBox='0 0 16 32' >
                <path d="M16 0 C16 16 8 16 0 16 C8 16 16 16 16 32" fill="white" stroke="black" />
              </svg>
            </span>
          }
        </div>
      </div>
      {unitSelection &&
        <UnitTypeSelector />
      }
    </div>
  )
}

export default observer(Tools)
