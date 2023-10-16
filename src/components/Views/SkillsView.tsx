import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { MapFiles, SCRIPTS_PATH, SKILLS_PATH } from '../../state/MapFiles'
import JsonNumberInput from '../ui/components/JsonNumberInput'
import JsonArrayInput from '../ui/components/JsonArrayInput'
import { SkillType, SkillsMap } from '../../types/types'
import { JsonArrayViewer } from '../ui/components/JsonArrayViewer'
import { AddJsonFileValue, DeleteJsonFileValue } from '../../state/actions/UpdateText'
import FileSelector from '../ui/components/FileSelector'
import { RenameObject } from '../../state/actions/RenameActions'

type SkillsStatsEditorProps = {
  skillType: string;
}

const SkillsStatsEditor = ({
  skillType
}:SkillsStatsEditorProps) => {
  if (!skillType) return null

  return <div className='vflex' style={{ padding: 6 }}>
    <span style={{ fontSize: 24, margin: '2px 0 6px 0' }}>
      {skillType}
    </span>
    
    <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
      <span className='view-input-title'>
        Script:
      </span>
      <FileSelector
        filesSourcePath={SCRIPTS_PATH}
        filePath={SKILLS_PATH}
        valuePath={`${skillType}.script`}
      />
    </div>

    <div className='hflex' style={{ alignItems: 'start', justifyContent: 'flex-start' }}>
      <span className='view-input-title'>
        Area script:
      </span>
      <FileSelector
        filesSourcePath={SCRIPTS_PATH}
        filePath={SKILLS_PATH}
        valuePath={`${skillType}.areaScript`}
      />
    </div>

    <JsonNumberInput
      placeholder='AOE radius'
      title='AOE radius'
      filePath={SKILLS_PATH}
      valuePath={`${skillType}.radius`}
      isInteger={true}
      min={0}
    />

    <JsonNumberInput
      placeholder='Mana cost'
      title='Mana cost'
      filePath={SKILLS_PATH}
      valuePath={`${skillType}.mana`}
      isInteger={true}
    />
    <JsonNumberInput
      placeholder='Minerals cost'
      title='Minerals cost'
      filePath={SKILLS_PATH}
      valuePath={`${skillType}.price`}
      isInteger={true}
    />
    <JsonNumberInput
      placeholder='Distance'
      title='Distance'
      filePath={SKILLS_PATH}
      valuePath={`${skillType}.range`}
      isInteger={true}
      min={0}
    />

    <JsonArrayInput
      title='Parameters'
      filePath={SKILLS_PATH}
      valuePath={`${skillType}.args`}
      placeholder='parameter'
    />
  </div>
}

const SkillsView = () => {
  const skillsMap = MapFiles.json[SKILLS_PATH] as SkillsMap
  const skillTypes = Object.keys(skillsMap).sort()

  const [selectedskillType, selectSkill] = useState<string>('')

  return <>
    <div className='view-container hflex' style={{ alignItems: 'normal' }}>
      <JsonArrayViewer 
        placeholder='Skill'
        items={skillTypes} 
        selectedItemId={selectedskillType} 
        selectItem={selectSkill}
        renameItem={(oldName, newName) => {
          selectSkill(newName)
          RenameObject("skill", oldName, newName)
        }}
        addItem={() => AddJsonFileValue<SkillType>(
          SKILLS_PATH, 
          'Skill', 
          { type: 'Skill', args: [], mana: 0, script: '', areaScript: '', price: 0, radius: 0, range: 0 },
          selectSkill
        )}
        deleteItem={id => {
          selectSkill('')
          DeleteJsonFileValue(SKILLS_PATH, id)
        }}
      />
      <div className='json-editor-container'>
        <SkillsStatsEditor skillType={selectedskillType} />
      </div>
    </div>
  </>
}

export default observer(SkillsView)
