
import React, { ReactElement } from 'react'
import './JsonEditor.css'
import { MapFiles } from '../../state/MapFiles'
import { observer } from 'mobx-react-lite'
import { TabType } from '../../types/types'
import { TabsErrors, TabsState } from '../../state/ToolState'
import { UpdateUnsavedData } from '../../state/actions/UpdateText'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-haxe'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import ReactAce from 'react-ace/lib/ace'

export type JsonEditorProps = {
  tab: TabType;
  filePath: string;
  mode: 'json'|'haxe';
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
      <EditorDiv tab={props.tab} error={error} filePath={props.filePath} mode={props.mode} />
    </div>
  )
}

export default observer(JsonEditor)

const EditorDiv = (props: JsonEditorProps & {
  error: string|null;
}) => {
  const editorRef = React.useRef<ReactAce>(null)
  const text = TabsState[props.tab] || MapFiles.text[props.filePath]

  React.useEffect(
    () => () => editorRef.current?.editor.getSession().getUndoManager().reset(), 
    [props.tab]
  )

  return (
    <AceEditor
      value={text}
      ref={editorRef}
      mode={props.mode}
      theme="twilight"
      onChange={newText => UpdateUnsavedData(props.tab, newText)}
      name="editorDiv"
      fontSize={14}
      tabSize={2}
      height={`calc(100vh - ${props.error ? 50 : 26}px)`}
      width="100%"
      setOptions={{ useWorker: false }}
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      showPrintMargin={false}
      editorProps={{ $blockScrolling: true }}
      commands={[{
        name: 'findNext',
        bindKey: { win: 'F3', mac: 'F3' },
        exec: 'findnext'
      }]}
    />
  )
}
