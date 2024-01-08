import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { UPGRADES_PATH, MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { UnitsMap, UpgradesMap, UpgradeType } from '../../types/types'
import { JsonArrayViewer } from '../ui/components/JsonArrayViewer'
import { AddJsonFileValue, DeleteJsonFileValue, RenameJsonFileValue } from '../../state/actions/UpdateText'
import JsonEffectsEditor from '../ui/components/JsonEffectsEditor'
import JsonArrayInput from '../ui/components/JsonArrayInput'

type UpgradeEditorProps = {
  upgradeId: string;
}

const UpgradeEditor = ({
  upgradeId
}:UpgradeEditorProps) => {
  if (!upgradeId) return null
  const unitsMap = MapFiles.json[UNITS_PATH] as UnitsMap
  const unitIds = Object.keys(unitsMap).sort()
  
  return <div className='vflex' style={{ padding: 6 }}>
    <div style={{ fontSize: 24, margin: '2px 0 6px 0' }}>
      {upgradeId}
    </div>
    <span style={{ fontSize: 20, marginTop: 8 }}>
      Affected Unit types:
    </span>
    <JsonArrayInput
      filePath={UPGRADES_PATH}
      valuesSource={unitIds}
      valuePath={`${upgradeId}.unitTypes`}
      placeholder='Unit type'
    />
    <JsonEffectsEditor 
      filePath={UPGRADES_PATH} 
      valuePath={`${upgradeId}.effects`} 
      title={'Effects'}
    />
  </div>
}

const UpgradesView = () => {
  const upgrades = MapFiles.json[UPGRADES_PATH] as UpgradesMap
  const upgradesArray = Object.keys(upgrades).sort()

  const [selectedUpgradeId, selectUpgrade] = useState<string>('')

  return <>
    <div className='view-container hflex' style={{ alignItems: 'normal' }}>
      <JsonArrayViewer 
        placeholder='Upgrade'
        items={upgradesArray} 
        selectedItemId={selectedUpgradeId} 
        selectItem={selectUpgrade}
        renameItem={(id, newName) => {
          selectUpgrade(newName)
          RenameJsonFileValue(UPGRADES_PATH, id, newName)
        }}
        addItem={() => AddJsonFileValue(
          UPGRADES_PATH, 
          'Upgrade', 
          { type: '', effects: [], unitTypes: [] },
          selectUpgrade
        )}
        deleteItem={id => {
          selectUpgrade('')
          DeleteJsonFileValue(UPGRADES_PATH, id)
        }}
      />
      <div className='json-editor-container'>
        <UpgradeEditor upgradeId={selectedUpgradeId} />
      </div>
    </div>
  </>
}

export default observer(UpgradesView)
