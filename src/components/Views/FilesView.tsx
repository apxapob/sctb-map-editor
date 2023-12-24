import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { MapFiles } from '../../state/MapFiles'
import BlobImage from '../ui/components/BlobImage'
import DirectoryViewer from '../ui/DirectoryViewer'

const FilesView = () => {
  const img = MapFiles.selectedFile

  return <>
    <div className='view-container hflex' style={{ alignItems: 'center' }}>
      <DirectoryViewer />
      <div className='view-container hflex'>
        <BlobImage path={img} containerCssClass='image-view-container' cssClass='image-view' />
      </div>
    </div>
  </>
}

export default observer(FilesView)
