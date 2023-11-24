import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { MapFiles, IMAGES_PATH } from '../../state/MapFiles'
import BlobImage from '../ui/components/BlobImage'
import DirectoryViewer from '../ui/DirectoryViewer'

const ImagesView = () => {
  const img = MapFiles.selectedImageFile

  return <>
    <div className='view-container hflex' style={{ alignItems: 'center' }}>
      <DirectoryViewer path={IMAGES_PATH.replace('/', '')} isImages />
      <div className='view-container hflex'>
        <BlobImage path={img} containerCssClass='image-view-container' cssClass='image-view' />
      </div>
    </div>
  </>
}

export default observer(ImagesView)
