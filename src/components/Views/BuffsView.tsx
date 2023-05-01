import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { BUFFS_PATH, MapFiles } from '../../state/MapFiles'
import JsonNumberInput from '../ui/components/JsonNumberInput'
import { BuffsMap } from '../../types/types'
import { JsonArrayViewer } from '../ui/components/JsonArrayViewer'
import { DeleteJsonFileValue, RenameJsonFileValue } from '../../state/actions/UpdateText'
import JsonEffectsEditor from '../ui/components/JsonEffectsEditor'

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
  const buffsArray = React.useMemo(() => Object.keys(buffs), [buffs])

  const [selectedBuffId, selectBuff] = useState<string>('')

  return <>
    <div className='view-container hflex' style={{ alignItems: 'normal' }}>
      <JsonArrayViewer 
        items={buffsArray} 
        selectedItemId={selectedBuffId} 
        selectItem={selectBuff}
        renameItem={(id, newName) => {
          selectBuff(newName)
          RenameJsonFileValue(BUFFS_PATH, id, newName)
        }}
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
