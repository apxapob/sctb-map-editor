import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { BUFFS_PATH, MapFiles } from '../../state/MapFiles'
import JsonNumberInput from '../ui/components/JsonNumberInput'
import { BuffType, BuffsMap } from '../../types/types'
import { JsonArrayViewer } from '../ui/components/JsonArrayViewer'
import { AddJsonFileValue, DeleteJsonFileValue, RenameJsonFileValue } from '../../state/actions/UpdateText'
import JsonEffectsEditor from '../ui/components/JsonEffectsEditor'
import { RenameObject } from '../../state/actions/RenameActions'

type BuffsEditorProps = {
  buffId: string;
}

const BuffEditor = ({
  buffId
}:BuffsEditorProps) => {
  if (!buffId) return null
  
  return <div className='vflex' style={{ padding: 6 }}>
    <span style={{ fontSize: 24, margin: '2px 0 6px 0' }}>
      {buffId}
    </span>
    <JsonNumberInput
      placeholder='Duration'
      title='Duration'
      tooltip='Amount of turns the buff stays active. Set -1 for infinite buffs'
      filePath={BUFFS_PATH}
      valuePath={`${buffId}.turns`}
      isInteger={true}
      min={-1}
    />
    <JsonEffectsEditor 
      filePath={BUFFS_PATH} 
      valuePath={`${buffId}.effects`} 
      title={'Effects'}
    />

  </div>
}

const BuffsView = () => {
  const buffs = MapFiles.json[BUFFS_PATH] as BuffsMap
  const buffsArray = Object.keys(buffs).sort()

  const [selectedBuffId, selectBuff] = useState<string>('')

  return <>
    <div className='view-container hflex' style={{ alignItems: 'normal' }}>
      <JsonArrayViewer 
        placeholder='Buff'
        items={buffsArray} 
        selectedItemId={selectedBuffId} 
        selectItem={selectBuff}
        renameItem={(oldName, newName) => {
          selectBuff(newName)
          RenameObject("buff", oldName, newName)
        }}
        addItem={() => AddJsonFileValue<BuffType>(
          BUFFS_PATH, 
          'Buff', 
          { type: '', effects: [], turns: 0 },
          selectBuff
        )}
        deleteItem={id => {
          selectBuff('')
          DeleteJsonFileValue(BUFFS_PATH, id)
        }}
      />
      <div className='json-editor-container'>
        <BuffEditor buffId={selectedBuffId} />
      </div>
    </div>
  </>
}

export default observer(BuffsView)
