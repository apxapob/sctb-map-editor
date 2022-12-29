
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
  const error = TabsErrors[props.tab]
  
  return (
    <div className='json-editor-container'>
      {TabsErrors[props.tab] &&
        <div className="error-div">
          {TabsErrors[props.tab]}
        </div>
      }
      <EditorDiv tab={props.tab} error={error} filePath={props.filePath} />
    </div>
  )
}

export default observer(JsonEditor)

const EditorDiv = (props: JsonEditorProps & {
  error: string;
}) => {
  const text = TabsState[props.tab] || MapFiles.text[props.filePath]
  
  return (
    <div className={`json-editor ${props.error ? 'parse-error' : ''}`} 
        style={{
          height: `calc(100vh - ${props.error ? 50 : 26}px)`
        }}
        contentEditable='true'
        suppressContentEditableWarning={true}
        onInput={e => updateText(props.tab, e.currentTarget.textContent)}>
      {text}
    </div>
  )
}

const updateText = action((tab:TabType, text:string|null) => {
  TabsState[tab] = text
})
