
import React, { ReactElement } from 'react'
import './JsonEditor.css'
import { MapFiles } from '../../state/MapFiles'

export type JsonEditorProps = {
  filePath: string | null;
}

export const JsonEditor = (props:JsonEditorProps):ReactElement|null => {
  if (props.filePath === null) return null

  const text = MapFiles.text[props.filePath]
  const parsed = JSON.parse(text)
  const formated = JSON.stringify(parsed, null, 2)
  return <div className={'json-editor'} >
    {formated}
  </div>
}
