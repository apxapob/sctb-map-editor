import React from 'react'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'
import { Selector } from './Selector'

const JsonArrayInput = (
  { filePath, valuePath, title, placeholder, valuesSource, tooltip, horizontal }:InputProps & { valuesSource?: string[], horizontal?:boolean }
) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const values = GetJsonFileValue(filePath, valuePath) as string[]

  const addInputParam = () => {
    if (!inputRef?.current?.value) { return }
    UpdateJsonFileValue(
      filePath,
      valuePath,
      [...values, inputRef.current.value]
    )
    inputRef.current.value = ''
  }

  return (
    <div 
      className={horizontal ? 'hflex' : 'vflex'} 
      style={{ alignItems: 'start', justifyContent: 'flex-start', flexWrap: 'wrap' }} 
      title={tooltip}
    >
      {title &&
        <div style={{ marginTop: 8 }}>
          {title}
        </div>
      }
      
      {values.map((value, idx) => 
        <div key={idx} style={{ margin: horizontal ? '0 6px 6px 0' : '0 6px' }}>
          <button 
            title={'Remove ' + placeholder}
            onClick={() => UpdateJsonFileValue(
              filePath,
              valuePath,
              [...values.slice(0, idx), ...values.slice(idx + 1)]
            )}
          >
            🗑️
          </button>
          &nbsp;
          {value}
        </div>
      )}
      {valuesSource && 
        <Selector 
          style={{ width: 'unset', margin: horizontal ? '0 6px 6px 0' : '0 6px' }}
          items={valuesSource} 
          value={'Add ' + placeholder}
          onSelect={newVal => UpdateJsonFileValue(
            filePath,
            valuePath,
            [...values, newVal]
          )}
        />
      }
      {!valuesSource && 
        <div className='hflex' style={{ gap: 6, margin: horizontal ? '0 6px 6px 0' : '0 6px' }}>
          <input ref={inputRef} />
          <button onClick={addInputParam}>
            ✓ Add {placeholder}
          </button>
        </div>
      }
    </div>
  )
}

export default observer(JsonArrayInput)
