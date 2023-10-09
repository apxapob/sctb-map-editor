import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { BUFFS_PATH, MapFiles, SKILLS_PATH, UNITS_IMAGES_PATH, UNITS_PATH } from '../../state/MapFiles'
import JsonNumberInput from '../ui/components/JsonNumberInput'
import JsonArrayInput from '../ui/components/JsonArrayInput'
import { BuffsMap, SkillsMap, UnitStatsType, UnitsMap } from '../../types/types'
import { JsonArrayViewer } from '../ui/components/JsonArrayViewer'
import { AddJsonFileValue } from '../../state/actions/UpdateText'
import BlobImage from '../ui/components/BlobImage'
import { DeleteEntity, RenameObject } from '../../state/actions/RenameActions'

type UnitsStatsEditorProps = {
  unitId: string;
}

const UnitImage = ({
  unitId
}:UnitsStatsEditorProps) => {
  return <BlobImage path={UNITS_IMAGES_PATH + unitId + '.png'} />
}

const UnitsStatsEditor = ({
  unitId
}:UnitsStatsEditorProps) => {
  if (!unitId) return null
  
  const skills = MapFiles.json[SKILLS_PATH] as SkillsMap
  const skillsArray = React.useMemo(() => Object.keys(skills), [skills])

  const buffs = MapFiles.json[BUFFS_PATH] as BuffsMap
  const buffsArray = React.useMemo(() => Object.keys(buffs), [buffs])

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

    <JsonArrayInput
      title='Skills'
      filePath={UNITS_PATH}
      valuePath={`${unitId}.skills`}
      placeholder='skill'
      valuesSource={skillsArray}
    />
    <JsonArrayInput
      title='Buffs'
      filePath={UNITS_PATH}
      valuePath={`${unitId}.buffs`}
      placeholder='buff'
      valuesSource={buffsArray}
    />
  </div>
}

const UnitsView = () => {
  const unitsMap = MapFiles.json[UNITS_PATH] as UnitsMap
  const unitIds = Object.keys(unitsMap).sort()

  const [selectedUnitId, selectUnit] = useState<string>('')

  return <>
    <div className='view-container hflex' style={{ alignItems: 'normal' }}>
      <JsonArrayViewer
        items={unitIds}
        placeholder='Unit'
        selectedItemId={selectedUnitId} 
        selectItem={selectUnit}
        renameItem={(oldName, newName) => {
          selectUnit(newName)
          RenameObject("unit", oldName, newName)
        }}
        addItem={() => AddJsonFileValue<UnitStatsType>(
          UNITS_PATH, 
          'Unit',
          { type: '', buffs: [], attack: 0, range: 0, speed: 0, vision: 0, detector: 0, invisible: 0, maxHp: 0, flying: 0, skills: [] },
          selectUnit
        )}
        deleteItem={id => {
          selectUnit('')
          DeleteEntity("unit", id)
        }}
      />
      
      <div className='unit-container'>
        <UnitsStatsEditor unitId={selectedUnitId} />
        {selectedUnitId &&
          <UnitImage unitId={selectedUnitId} />
        }
      </div>
    </div>
  </>
}

export default observer(UnitsView)
