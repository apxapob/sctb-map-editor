
import React from 'react'
import './EditorDiv.css'
import { FIELDS_PATH, MapFiles } from '../../state/MapFiles'
import { UnsavedFiles } from '../../state/ToolState'
import { UpdateUnsavedData } from '../../state/actions/UpdateText'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-haxe'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import ReactAce from 'react-ace/lib/ace'
import { SelectTab } from '../../state/actions/SelectTab'

type EditorDivProps = {
  error: string|null;
  mode: string;
  filePath: string;
}

export const EditorDiv = ({ error, mode, filePath }: EditorDivProps) => {
  const editorRef = React.useRef<ReactAce>(null)
  const text = UnsavedFiles[filePath] || MapFiles.text[filePath] || ''

  React.useEffect(
    () => () => editorRef.current?.editor.getSession().getUndoManager().reset(), 
    [filePath]
  )

  if(filePath?.startsWith(FIELDS_PATH)){
    return <div>
      Can't show this file contents here. Look in <a className='url' onClick={() => SelectTab('Field')}>Field</a> tab
    </div>
  }

  return <AceEditor
    value={text}
    ref={editorRef}
    mode={mode}
    theme="twilight"
    onChange={newText => UpdateUnsavedData(filePath, newText)}
    name="editorDiv"
    fontSize={14}
    tabSize={2}
    height={`calc(100vh - ${error ? 50 : 26}px)`}
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
}
