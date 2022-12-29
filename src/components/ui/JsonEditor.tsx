
import React, { ReactElement } from 'react'
import './JsonEditor.css'
import { MapFiles } from '../../state/MapFiles'
import { observer } from 'mobx-react-lite'
import { TabType } from '../../types/types'
import { TabsErrors, TabsState } from '../../state/ToolState'
import { action } from 'mobx'

export type JsonEditorProps = {
  tab: TabType;
  filePath: string;
}

const JsonEditor = (props:JsonEditorProps):ReactElement|null => {
  const text = MapFiles.text[props.filePath]
  const error = TabsErrors[props.tab]
  
  return (
    <div className='json-editor-container'>
      {TabsErrors[props.tab] &&
        <div className="error-div">
          {TabsErrors[props.tab]}
        </div>
      }
      <div className={`json-editor ${error ? 'parse-error' : ''}`} 
        style={{
          height: `calc(100vh - ${error ? 50 : 26}px)`
        }}
        contentEditable='true'
        suppressContentEditableWarning={true}
        onInput={action(e => {
          TabsState[props.tab] = e.currentTarget.textContent
        })}>
        {text}
      </div>
    </div>
  )
}

export default observer(JsonEditor)
