import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { MapFiles, SCRIPTS_PATH, SKILLS_PATH } from '../../state/MapFiles'
import JsonNumberInput from '../ui/components/JsonNumberInput'
import JsonArrayInput from '../ui/components/JsonArrayInput'
import { SkillType, SkillsMap } from '../../types/types'
import { JsonArrayViewer } from '../ui/components/JsonArrayViewer'
import { AddJsonFileValue, DeleteJsonFileValue, GetJsonFileValue, RenameJsonFileValue, UpdateJsonFileValue } from '../../state/actions/UpdateText'
import { Selector } from '../ui/components/Selector'

type SkillsStatsEditorProps = {
  skillId: string;
}

const SkillsStatsEditor = ({
  skillId
}:SkillsStatsEditorProps) => {
  if (!skillId) return null
  
  const scripts = Object.keys(MapFiles.text)
    .filter(filename => filename.startsWith(SCRIPTS_PATH))
    .map(filename => filename.replace(SCRIPTS_PATH, ''))
  const script = GetJsonFileValue(SKILLS_PATH, `${skillId}.script`) as string

  return <div className='vflex' style={{ padding: 6 }}>
    <span style={{ fontSize: 24, margin: '2px 0 6px 0' }}>
      {skillId}
    </span>
    
    <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
      <span className='view-input-title'>
        Script:
      </span>
      <Selector
        value={script}
        style={{ width: 'unset', margin: 0 }}
        items={scripts}
        onSelect={newVal => UpdateJsonFileValue(
          SKILLS_PATH,
          `${skillId}.script`,
          newVal
        )}
      />
    </div>

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
      placeholder='Distance'
      title='Distance'
      filePath={SKILLS_PATH}
      valuePath={`${skillId}.range`}
      isInteger={true}
      min={0}
    />

    <JsonArrayInput
      title='Parameters'
      filePath={SKILLS_PATH}
      valuePath={`${skillId}.args`}
      placeholder='parameter'
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
        placeholder='Skill'
        items={skillIds} 
        selectedItemId={selectedSkillId} 
        selectItem={selectSkill}
        renameItem={(id, newName) => {
          selectSkill(newName)
          RenameJsonFileValue(SKILLS_PATH, id, newName)
        }}
        addItem={() => AddJsonFileValue<SkillType>(
          SKILLS_PATH, 
          'Skill', 
          { id: '', args: [], mana: 0, script: '', price: 0, radius: 0, range: 0 },
          selectSkill
        )}
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
