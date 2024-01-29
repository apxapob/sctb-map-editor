import { observer } from 'mobx-react-lite'
import React from 'react'
import { MapFiles } from '../../../state/MapFiles';
import { SpriteSheetInfo } from '../../../types/types';
import JsonNumberInput from './JsonNumberInput';

type SpriteSheetOptionsProps = {
  configPath: string;
  dirNumber: number;
}

const SpriteSheetOptions = ({ configPath, dirNumber }:SpriteSheetOptionsProps) => {

  const { packer, sprites } = MapFiles.json[configPath] as SpriteSheetInfo
  const directions = packer.directions ?? 1
  return <div className='vflex' style={{ alignItems: 'center', gap: 2 }}>
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
      min={1}
      max={12}
    />
    {Array(directions).fill(0).map((_, idx)=>
      <div key={idx} className={'sprite-direction-config ' + (dirNumber === idx ? 'sprite-current-direction':'')}>
        <JsonNumberInput
          placeholder="0.7"
          title={`Direction ${idx+1} width`}
          tooltip={`Width for Direction ${idx+1} sprites. 1 = hex width`}
          filePath={configPath}
          valuePath={`packer.dir${idx+1}_width`}
          isInteger={false}
          min={0}
          max={10}
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