import { observer } from 'mobx-react-lite'
import React from 'react'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText';
import { type } from 'os';
import { SCRIPTS_PATH, SKILLS_PATH } from '../../../state/MapFiles';
import FileSelector from './FileSelector';
import JsonArrayInput from './JsonArrayInput';

export type JsonScriptsListProps = {
  filePath: string;
  valuePath: string;
  title?: string;
  tooltip?: string;
}

export type MapScriptType = {
  id: string;
  params: string[];
}

const JsonScriptsList = ({ 
  filePath, valuePath, title, tooltip
}:JsonScriptsListProps) => {
  const scripts = (GetJsonFileValue(filePath, valuePath) ?? []) as MapScriptType[] 

  return <div style={{ width: '100%' }}>
    <h3 title={tooltip}>
    {title}
    </h3>
    {scripts.map((s, idx) => 
      <div className='script-item' key={idx}>
        Script: 
        <br/>
        <div>
          <FileSelector
            filesSourcePath={SCRIPTS_PATH}
            filePath={filePath}
            valuePath={`${valuePath}.${idx}.id`}
          />
          &nbsp;
          <button 
            title='Remove script'
            onClick={() => UpdateJsonFileValue(
              filePath,
              valuePath,
              [...scripts.slice(0, idx), ...scripts.slice(idx + 1)]
            )}
          >
            🗑️
          </button>
        </div>
        <JsonArrayInput
          title='Parameters'
          filePath={filePath}
          valuePath={`${valuePath}.${idx}.params`}
          placeholder='parameter'
        />
      </div>
    )}
    <button 
      onClick={() => UpdateJsonFileValue(
        filePath,
        valuePath,
        [ ...scripts, { id: "", params: [] } ]
      )}>
      Add Script
    </button>
  </div>
}

export default observer(JsonScriptsList)