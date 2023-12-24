import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { MapFiles } from '../../state/MapFiles'
import BlobImage from '../ui/components/BlobImage'
import DirectoryViewer from '../ui/DirectoryViewer'
import { EditorDiv } from '../ui/JsonEditor'
import { EditorState, TabsErrors } from '../../state/ToolState'

const FilesView = () => {
  const filePath = MapFiles.selectedFile
  const mode = filePath.endsWith('.json') ? 'json' : 'haxe'
  const tab = EditorState.activeTab
  const error = TabsErrors[tab] ?? null

  return <>
    <div className='view-container hflex' style={{ alignItems: 'center' }}>
      <DirectoryViewer />
      <div className='view-container hflex'>
        {filePath.endsWith(".png") 
          ? <BlobImage path={filePath} containerCssClass='image-view-container' cssClass='image-view' />
          : <EditorDiv tab={tab} error={error} filePath={filePath} mode={mode} />
        }
      </div>
    </div>
  </>
}

export default observer(FilesView)
