import { observer } from 'mobx-react-lite'
import React from 'react'
import { MapFiles } from '../../../state/MapFiles';
import { SpriteSheetInfo } from '../../../types/types';
import JsonNumberInput from './JsonNumberInput';

type SpriteSheetOptionsProps = {
  configPath: string;
}

const SpriteSheetOptions = ({ configPath }:SpriteSheetOptionsProps) => {

  const { packer, sprites } = MapFiles.json[configPath] as SpriteSheetInfo
  const directions = packer.directions ?? 1

  return <div className='vflex' style={{ alignItems: 'center' }}>
    <JsonNumberInput
      placeholder={sprites.length + ''}
      title="Animation Frames"
      tooltip="Number of frames in animation"
      filePath={configPath}
      valuePath="packer.animationFramesNum"
      isInteger={true}
      min={0}
    />
    <JsonNumberInput
      placeholder='1'
      title="Directions"
      tooltip="Number of directions in the spritesheet"
      filePath={configPath}
      valuePath="packer.directions"
      isInteger={true}
      min={0}
    />
    {Array(directions).fill(0).map((_, idx)=>
      <div key={idx}>
        <JsonNumberInput
          placeholder="0.8"
          title={`Direction ${idx+1} width`}
          tooltip={`Width for Direction ${idx+1} sprites. 1 = hex width`}
          filePath={configPath}
          valuePath={`packer.dir${idx+1}_width`}
          isInteger={false}
          min={0}
          max={1}
        />
        <JsonNumberInput
          placeholder='0'
          title={`Direction ${idx+1} X offset`}
          tooltip={`Horizontal offset for Direction ${idx+1} sprites`}
          filePath={configPath}
          valuePath={`packer.dir${idx+1}_dx`}
          isInteger={false}
        />
        <JsonNumberInput
          placeholder='0'
          title={`Direction ${idx+1} Y offset`}
          tooltip={`Vertical offset for Direction ${idx+1} sprites`}
          filePath={configPath}
          valuePath={`packer.dir${idx+1}_dy`}
          isInteger={false}
        />
      </div>
    )}
    
  </div>
}

export default observer(SpriteSheetOptions)