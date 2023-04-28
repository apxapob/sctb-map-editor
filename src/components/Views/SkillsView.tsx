import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { MapFiles, SKILLS_PATH, UNITS_PATH } from '../../state/MapFiles'
import JsonNumberInput from '../ui/components/JsonNumberInput'
import JsonArrayInput from '../ui/components/JsonArrayInput'
import { SkillsMap, UnitsMap } from '../../types/types'
import { JsonArrayViewer } from '../ui/components/JsonArrayViewer'
import { DeleteJsonFileValue, RenameJsonFileValue } from '../../state/actions/UpdateText'
import JsonStringInput from '../ui/components/JsonStringInput'

type SkillsStatsEditorProps = {
  skillId: string;
}

const SkillsStatsEditor = ({
  skillId
}:SkillsStatsEditorProps) => {
  if (!skillId) return null
  
  const units = MapFiles.json[UNITS_PATH] as UnitsMap
  const unitsArray = React.useMemo(() => Object.keys(units), [units])

  //TODO: scripts to dropdown
  return <div className='vflex' style={{ padding: 6 }}>
    <span style={{ fontSize: 24, margin: '2px 0 6px 0' }}>
      {skillId}
    </span>
    <JsonStringInput
      placeholder='Script'
      title="Script"
      filePath={SKILLS_PATH}
      valuePath={`${skillId}.script`}
    />
    <JsonNumberInput
      placeholder='Mana cost'
      title='Mana cost'
      filePath={SKILLS_PATH}
      valuePath={`${skillId}.mana`}
      isInteger={true}
    />
    <JsonNumberInput
      placeholder='Minerals cost'
      title='Minerals cost'
      filePath={SKILLS_PATH}
      valuePath={`${skillId}.price`}
      isInteger={true}
    />
    <JsonNumberInput
      placeholder='AOE radius'
      title='AOE radius'
      filePath={SKILLS_PATH}
      valuePath={`${skillId}.radius`}
      isInteger={true}
      min={0}
    />
    <JsonNumberInput
      placeholder='Min dist to target'
      title='Min dist to target'
      filePath={SKILLS_PATH}
      valuePath={`${skillId}.range`}
      isInteger={true}
      min={0}
    />

    <JsonArrayInput
      title='Parameters'
      filePath={SKILLS_PATH}
      valuePath={`${skillId}.args`}
      placeholder='buff'
      valuesSource={unitsArray}
    />
  </div>
}

const SkillsView = () => {
  const skillsMap = MapFiles.json[SKILLS_PATH] as SkillsMap
  const skillIds = Object.keys(skillsMap).sort()

  const [selectedSkillId, selectSkill] = useState<string>('')

  return <>
    <div className='view-container hflex' style={{ alignItems: 'normal' }}>
      <JsonArrayViewer 
        items={skillIds} 
        selectedItemId={selectedSkillId} 
        selectItem={selectSkill}
        renameItem={(id, newName) => {
          selectSkill(newName)
          RenameJsonFileValue(SKILLS_PATH, id, newName)
        }}
        deleteItem={id => {
          selectSkill('')
          DeleteJsonFileValue(SKILLS_PATH, id)
        }}
      />
      <div className='json-editor-container'>
        <SkillsStatsEditor skillId={selectedSkillId} />
      </div>
    </div>
  </>
}

export default observer(SkillsView)
