import React from 'react'
import { ChangeEffectType, GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'
import { EffectType, EffectTypes, Effects } from '../../../types/types'
import { Selector } from './Selector'
import ScriptSelector from './ScriptSelector'
import './EffectsEditor.css'

type EffectEditorProps = { 
  effect: EffectType;
  removeEffect: () => void;
  filePath: string;
  effectPath: string ;
  idx: number;
}

const EffectEditor = observer((
  { effect, removeEffect, filePath, effectPath, idx }: EffectEditorProps
) => {
  const type = Object.keys(effect)[0] as Effects
  const data = typeof effect !== 'string' ? effect[type] : null
  /*
  args?: string[];
  stat?: StatType;
  delta?: number;
  id?: string;//skillId
  //skill: SkillType;//custom skill

  //Aura params:
  radius?: number;
  effects?: EffectType[];
  affects?: Affects, 
  particles?: string;
  color?: ColorAdjust;
  */
  return <div className='effect-editor'>
    <button 
      title={'Remove Effect'}
      onClick={removeEffect}
    >
      🗑️
    </button>
    <div className='effect-param'>
      Type
      <Selector 
        value={type}
        style={{ width: 'unset', margin: 0 }}
        items={EffectTypes}
        onSelect={newVal => ChangeEffectType(
          filePath,
          effectPath,
          idx,
          newVal as Effects
        )}
      />
    </div>
    {data?.value !== undefined &&
      <div className='effect-param'>
        Value
        <div>
          {data.value}
        </div>
      </div>
    }
    {data?.script !== undefined &&
      <div className='effect-param'>
        Script
        <ScriptSelector
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.script`}
        />
      </div>
    }
    {data?.args !== undefined &&
      <div className='effect-param'>
        Parameters
        <div>
          {data.args}
        </div>
      </div>
    }
    {data?.stat !== undefined &&
      <div className='effect-param'>
        Stat
        <div>
          {data.stat}
        </div>
      </div>
    }
    {data?.delta !== undefined &&
      <div className='effect-param'>
        Change
        <div>
          {data.delta}
        </div>
      </div>
    }
    {data?.id !== undefined &&
      <div className='effect-param'>
        Skill Id
        <div>
          {data.id}
        </div>
      </div>
    }
    {data?.radius !== undefined &&
      <div className='effect-param'>
        Aura size
        <div>
          {data.radius}
        </div>
      </div>
    }
    {data?.affects !== undefined &&
      <div className='effect-param'>
        Affects
        <div>
          {data.affects}
        </div>
      </div>
    }
    {data?.particles !== undefined &&
      <div className='effect-param'>
        Visual effect
        <div>
          {data.particles}
        </div>
      </div>
    }
  </div>
})

const JsonEffectsEditor = (
  { filePath, valuePath, title, tooltip }:InputProps
) => {
  const effects = GetJsonFileValue(filePath, valuePath) as EffectType[]
  
  return (
    <div className='effect-editor-container' title={tooltip}>
      <div style={{ fontSize: 20, marginTop: 8 }}>
        {title}
      </div>
      
      {effects.map((value, idx) => 
        <EffectEditor 
          key={idx}
          effect={value}
          removeEffect={() => UpdateJsonFileValue(
            filePath,
            valuePath,
            [...effects.slice(0, idx), ...effects.slice(idx + 1)]
          )} 
          filePath={filePath} 
          effectPath={valuePath}
          idx={idx}
        />
      )}
      <button style={{ margin: '12px 6px' }}>
        Add Effect
      </button>
    </div>
  )
}

export default observer(JsonEffectsEditor)
