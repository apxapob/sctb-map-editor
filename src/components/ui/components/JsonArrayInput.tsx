import React from 'react'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'
import { Selector } from './Selector'

const JsonArrayInput = (
  { filePath, valuePath, title, placeholder, valuesSource, tooltip }:InputProps & { valuesSource?: string[] }
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
    <div className='vflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }} title={tooltip}>
      <div style={{ fontSize: 20, marginTop: 8 }}>
        {title}
      </div>
      
      {values.map((value, idx) => 
        <div key={idx} style={{ margin: '0 6px' }}>
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
          style={{ width: 'unset', margin: '0 6px' }}
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
        <div className='hflex' style={{ gap: 6, margin: '0 6px' }}>
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
