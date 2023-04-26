import React, { ReactElement } from 'react'
import { GetJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './JsonValueInput.css'
import { InputProps } from './JsonStringInput'
import { Selector } from './Selector'

const JsonArrayInput = (
  { filePath, valuePath, title, placeholder, valuesSource }:InputProps & { valuesSource: string[] }
):ReactElement => {
  const values = GetJsonFileValue(filePath, valuePath) as string[]
  return (
    <div className='vflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
      <div style={{ fontSize: 20, marginTop: 8 }}>
        {title}
      </div>
      
      {values.map((value, idx) => 
        <div key={idx} style={{ margin: '0 6px' }}>
          <button onClick={() => console.log('!!! remove', value)}>
            ✗
          </button>
          &nbsp;
          {value}
        </div>
      )}
      <Selector 
        style={{ width: 'unset', margin: '0 6px' }}
        items={valuesSource} 
        placeholder={'Add ' + placeholder}
        onSelect={newVal => console.log('!!! add', newVal)} 
      />
    </div>
  )
}

export default observer(JsonArrayInput)
