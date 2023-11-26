import { observer } from 'mobx-react-lite'
import React from 'react'
import { ITEMS_IMAGES_PATH, ITEMS_PATH, UNITS_IMAGES_PATH, UNITS_PATH } from '../../../state/MapFiles'
import { GetJsonFileValue } from '../../../state/actions/UpdateText'
import BlobImage from './BlobImage'
import FileSelector from './FileSelector'

type ObjectImageProps = {
  objId: string;
  type: 'unit'|'item';
}

const ObjectImage = ({ objId, type }:ObjectImageProps) => {
  const valuePath = `${objId}.image`
  const dirPath = type === 'unit' ? UNITS_IMAGES_PATH : ITEMS_IMAGES_PATH
  const infoPath = type === 'unit' ? UNITS_PATH : ITEMS_PATH

  const path = dirPath + GetJsonFileValue(infoPath, valuePath)
  return <div className='vflex' style={{ alignItems: 'center', gap: 0 }}>
    <BlobImage path={path} />
    
    <FileSelector
      filesSourcePath={dirPath}
      filePath={infoPath}
      fileType='binary'
      valuePath={valuePath}
    />
  </div>
}

export default observer(ObjectImage)