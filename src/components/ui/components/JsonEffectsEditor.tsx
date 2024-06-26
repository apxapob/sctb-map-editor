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
import JsonValueSelector from './JsonValueSelector'
import JsonArrayInput from './JsonArrayInput'
import JsonColorSelector from './JsonColorSelector'
import { EffectTemplates } from '../../../types/types'

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
  const data = typeof effect !== 'string' ? effect[type] : {}
  const AllSkills = Object.keys(MapFiles.json[SKILLS_PATH])

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
    {'value' in data &&
      <div className='effect-param'>
        Value
        <JsonNumberInput 
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.value`}
          min={0}
          isInteger={true} />
      </div>
    }
    {'script' in data &&
      <div className='effect-param'>
        Script
        <FileSelector
          filesSourcePath={SCRIPTS_PATH}
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.script`}
        />
      </div>
    }
    {'stat' in data &&
      <div className='effect-param'>
        Stat
        <JsonValueSelector 
          values={AllStats}
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.stat`}
        />
      </div>
    }
    {'delta' in data &&
      <div className='effect-param'>
        Change
        <JsonNumberInput 
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.delta`}
          isInteger={true} />
      </div>
    }
    {'id' in data &&
      <div className='effect-param'>
        Skill Id
        <JsonValueSelector 
          values={AllSkills}
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.id`}
        />
      </div>
    }
    {'radius' in data &&
      <div className='effect-param'>
        Aura size
        <JsonNumberInput 
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.radius`}
          min={0} max={99}
          isInteger={true} />
      </div>
    }
    {'affects' in data &&
      <div className='effect-param'>
        Affects
        <JsonValueSelector 
          values={AllAffects}
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.affects`}
        />
      </div>
    }
    {'particles' in data &&
      <div className='effect-param'>
        Visual effect
        <FileSelector
          filesSourcePath={PARTICLES_PATH}
          filePath={filePath}
          valuePath={`${effectPath}.${idx}.${type}.particles`}
        />
      </div>
    }
    {'color' in data &&
      <>
        <div className='effect-param'>
          Color
          <JsonColorSelector 
            filePath={filePath}
            valuePath={`${effectPath}.${idx}.${type}.color.gain.color`}
          />
        </div>
        <div className='effect-param'>
          Alpha
          <JsonNumberInput 
            filePath={filePath}
            valuePath={`${effectPath}.${idx}.${type}.color.gain.alpha`}
            min={0} max={1}
            isInteger={false} 
          />
        </div>
      </>
    }
    {'args' in data &&
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
    {'effects' in data &&
      <div className='effect-param aura-effects-editor'>
        <JsonEffectsEditor 
          filePath={filePath} 
          valuePath={`${effectPath}.${idx}.${type}.effects`}
          title={'Aura effects'}
        />
      </div>
    }
  </div>
})

const JsonEffectsEditor = observer((
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
      <button 
        style={{ margin: '12px 6px' }} 
        onClick={() => UpdateJsonFileValue(
          filePath,
          valuePath,
          [
            ...effects, 
            { ChangeStat:{ ...EffectTemplates.ChangeStat } }
          ]
        )}
        >
        Add Effect
      </button>
    </div>
  )
})

export default JsonEffectsEditor
