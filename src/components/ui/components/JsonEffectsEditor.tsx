import React from 'react'
import { ChangeEffectType, GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'
import { AllAffects, AllStats, EffectType, EffectTypes, Effects } from '../../../types/types'
import { Selector } from './Selector'
import FileSelector from './FileSelector'
import './EffectsEditor.css'
import JsonNumberInput from './JsonNumberInput'
import { MapFiles, PARTICLES_PATH, SCRIPTS_PATH, SKILLS_PATH } from '../../../state/MapFiles'
import ValueSelector from './ValueSelector'
import JsonArrayInput from './JsonArrayInput'

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
  const AllSkills = Object.keys(MapFiles.json[SKILLS_PATH])
  console.log('!!! effect editor render')
  /*
  //Aura params:
  effects?: EffectType[];
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
        <JsonNumberInput 
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.value`}
          min={0}
          isInteger={true} />
      </div>
    }
    {data?.script !== undefined &&
      <div className='effect-param'>
        Script
        <FileSelector
          sourcePath={SCRIPTS_PATH}
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.script`}
        />
      </div>
    }
    {data?.stat !== undefined &&
      <div className='effect-param'>
        Stat
        <ValueSelector 
          values={AllStats}
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.stat`}
        />
      </div>
    }
    {data?.delta !== undefined &&
      <div className='effect-param'>
        Change
        <JsonNumberInput 
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.delta`}
          isInteger={true} />
      </div>
    }
    {data?.id !== undefined &&
      <div className='effect-param'>
        Skill Id
        <ValueSelector 
          values={AllSkills}
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.id`}
        />
      </div>
    }
    {data?.radius !== undefined &&
      <div className='effect-param'>
        Aura size
        <JsonNumberInput 
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.radius`}
          min={0} max={99}
          isInteger={true} />
      </div>
    }
    {data?.affects !== undefined &&
      <div className='effect-param'>
        Affects
        <ValueSelector 
          values={AllAffects}
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.affects`}
        />
      </div>
    }
    {data?.particles !== undefined &&
      <div className='effect-param'>
        Visual effect
        <FileSelector
          sourcePath={PARTICLES_PATH}
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.particles`}
        />
      </div>
    }
    {data?.color !== undefined &&
      <div className='effect-param'>
        Color adjust
        
      </div>
    }
    {data?.effects !== undefined &&
      <div className='effect-param'>
        Aura effect
        {data?.effects.length}
      </div>
    }

    {data?.args !== undefined &&
      <div className='effect-param'>
        Parameters
        <JsonArrayInput
          horizontal
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.args`}
          placeholder='parameter'
        />
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
