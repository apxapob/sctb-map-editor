import React, { ReactElement, useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { MapFiles, UNITS_PATH } from '../../state/MapFiles'
import { UnitStatsType } from '../../types/types'
import JsonEditor from '../ui/JsonEditor'
import JsonNumberInput from '../ui/components/JsonNumberInput'

type UnitsMap = {
  [index: string]: UnitStatsType;
}

type UnitsStatsEditorProps = {
  unitId: string;
}

const UnitsStatsEditor = ({
  unitId
}:UnitsStatsEditorProps):ReactElement|null => {
  if (!unitId) return null
  /*
  'buffs': [],
  'skills': ['build_worker', 'build_observer', 'recall'],
  */
  return <div className='vflex' style={{ padding: 6 }}>
    <span style={{ fontSize: 24, margin: '2px 0 6px 0' }}>
      {unitId}
    </span>
    <JsonNumberInput
      placeholder='Max Health'
      title='Max Health'
      filePath={UNITS_PATH}
      valuePath={`${unitId}.maxHp`}
      isInteger={true}
      min={0}
    />
    <JsonNumberInput
      placeholder='Attack'
      title='Attack'
      filePath={UNITS_PATH}
      valuePath={`${unitId}.attack`}
      isInteger={true}
      min={0}
    />
    <JsonNumberInput
      placeholder='Range'
      title='Range'
      filePath={UNITS_PATH}
      valuePath={`${unitId}.range`}
      isInteger={true}
      min={0}
    />
    <JsonNumberInput
      placeholder='Move speed'
      title='Move speed'
      filePath={UNITS_PATH}
      valuePath={`${unitId}.speed`}
      isInteger={true}
      min={0}
    />
    <JsonNumberInput
      placeholder='Vision range'
      title='Vision range'
      filePath={UNITS_PATH}
      valuePath={`${unitId}.vision`}
      isInteger={true}
      min={0}
    />
    <JsonNumberInput
      placeholder='Flying height'
      title='Flying height'
      filePath={UNITS_PATH}
      valuePath={`${unitId}.flying`}
      isInteger={true}
      min={0}
    />
    <JsonNumberInput
      placeholder='Detection range'
      title='Detection range'
      filePath={UNITS_PATH}
      valuePath={`${unitId}.detector`}
      isInteger={true}
      min={0}
    />
    <JsonNumberInput
      placeholder='Invisibility power'
      title='Invisibility power'
      filePath={UNITS_PATH}
      valuePath={`${unitId}.invisible`}
      isInteger={true}
      min={0}
    />
  </div>
}

const UnitsView = ():ReactElement => {
  const unitsMap = MapFiles.json[UNITS_PATH] as UnitsMap

  const [selectedUnitId, selectUnit] = useState<string>('')

  return <>
    <div className='view-container hflex' style={{ alignItems: 'normal' }}>
      <div className='dir-viewer-container'>
        {Object.keys(unitsMap).map(unitId =>
          <div className={`node ${ selectedUnitId === unitId ? 'selected-item' : '' }`}
            key={unitId} 
            onClick={() => selectUnit(unitId)}>
            {unitId}
          </div>
        )}
      </div>
      <div className='json-editor-container'>
        <UnitsStatsEditor unitId={selectedUnitId} />
      </div>
    </div>
    <JsonEditor />
  </>
}

export default observer(UnitsView)
