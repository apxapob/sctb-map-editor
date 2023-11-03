import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { MapFiles, IMAGES_PATH } from '../../state/MapFiles'
import BlobImage from '../ui/components/BlobImage'
import DirectoryViewer from '../ui/DirectoryViewer'

const ImagesView = () => {
  const img = MapFiles.selectedImageFile

  return <>
    <div className='view-container hflex' style={{ alignItems: 'normal' }}>
      <DirectoryViewer path={IMAGES_PATH.replace('/', '')} isImages />
      <div className='view-container'>
        <BlobImage path={img} />
      </div>
    </div>
  </>
}

export default observer(ImagesView)
