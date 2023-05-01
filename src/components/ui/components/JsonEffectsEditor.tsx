import React from 'react'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'
import { EffectType, Effects } from '../../../types/types'

const EffectEditor = (
  { effect, removeEffect }: { effect: EffectType, removeEffect: () => void }
) => {
  const type = Object.keys(effect)[0] as Effects
  const data = typeof effect !== 'string' ? effect[type] : null

  /*
  script?: string;
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
  return <div className='hflex' style={{ gap: 12, alignItems: 'center' }}>
    <button 
      title={'Remove Effect'}
      onClick={removeEffect}
    >
      ✗
    </button>
    <div className='effect-param'>
      Type
      <div>
        {type}
      </div>
    </div>
    {data?.value &&
      <div className='effect-param'>
        Value
        <div>
          {data.value}
        </div>
      </div>
    }
    {data?.script &&
      <div className='effect-param'>
        Script
        <div>
          {data.script}
        </div>
      </div>
    }
    {data?.args &&
      <div className='effect-param'>
        Parameters
        <div>
          {data.args}
        </div>
      </div>
    }
    {data?.stat &&
      <div className='effect-param'>
        Stat
        <div>
          {data.stat}
        </div>
      </div>
    }
    {data?.delta &&
      <div className='effect-param'>
        Change
        <div>
          {data.delta}
        </div>
      </div>
    }
    {data?.id &&
      <div className='effect-param'>
        Skill Id
        <div>
          {data.id}
        </div>
      </div>
    }
    {data?.radius &&
      <div className='effect-param'>
        Aura size
        <div>
          {data.radius}
        </div>
      </div>
    }
    {data?.affects &&
      <div className='effect-param'>
        Affects
        <div>
          {data.affects}
        </div>
      </div>
    }
    {data?.particles &&
      <div className='effect-param'>
        Visual effect
        <div>
          {data.particles}
        </div>
      </div>
    }
  </div>
}

const JsonEffectsEditor = (
  { filePath, valuePath, title, tooltip }:InputProps
) => {
  const effects = GetJsonFileValue(filePath, valuePath) as EffectType[]
  
  return (
    <div className='vflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }} title={tooltip}>
      <div style={{ fontSize: 20, marginTop: 8 }}>
        {title}
      </div>
      
      {effects.map((value, idx) => 
        <div key={idx} style={{ margin: '0 6px' }}>
          <EffectEditor 
            effect={value} 
            removeEffect={() => UpdateJsonFileValue(
              filePath,
              valuePath,
              [...effects.slice(0, idx), ...effects.slice(idx + 1)]
            )}
          />
        </div>
      )}
      {/*
        <Selector 
          style={{ width: 'unset', margin: '0 6px' }}
          items={valuesSource} 
          value={'Add ' + placeholder}
          onSelect={newVal => UpdateJsonFileValue(
            filePath,
            valuePath,
            [...values, newVal]
          )}
        />
      */}
    </div>
  )
}

export default observer(JsonEffectsEditor)
