import React from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { getDirPath, getFilePath } from '../../state/MapFiles'
import BlobImage from '../ui/components/BlobImage'
import DirectoryViewer from '../ui/DirectoryViewer'
import { EditorDiv } from '../ui/EditorDiv'
import { EditorState, FileErrors } from '../../state/ToolState'

const FilesView = () => {
  const filePath = getFilePath(EditorState.activeTab)
  const error = FileErrors[filePath] ?? null
  const mode = filePath.endsWith('.json') ? 'json' : 'haxe'
  const dirPath = getDirPath(EditorState.activeTab).replace('/', '')

  EditorState.editorTrigger//just subscribing to the trigger

  return <>
    <div className='view-container hflex' style={{ alignItems: 'center' }}>
      <DirectoryViewer path={dirPath} />
      <div className='view-container vflex' style={{ gap: 0 }}>
        {error &&
          <div className="error-div">
            {error}
          </div>
        }
        {filePath && 
          (filePath.endsWith(".png") 
              ? <BlobImage path={filePath} containerCssClass='image-view-container' cssClass='image-view' />
              : <EditorDiv error={error} filePath={filePath} mode={mode} />
          )
        }
        
      </div>
    </div>
  </>
}

export default observer(FilesView)
