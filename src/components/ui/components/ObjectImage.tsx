import { observer } from 'mobx-react-lite'
import React from 'react'
import { ITEMS_IMAGES_PATH, ITEMS_PATH, UNITS_IMAGES_PATH, UNITS_PATH } from '../../../state/MapFiles'
import { GetJsonFileValue } from '../../../state/actions/UpdateText'
import SpriteViewer from './SpriteViewer'
import FileSelector from './FileSelector'
import { SortSprites } from '../../../utils/spriteUtils'

type ObjectImageProps = {
  objId: string;
  type: 'unit'|'item';
}

const ObjectImage = ({ objId, type }:ObjectImageProps) => {
  const valuePath = `${objId}.image`
  const spriteSheetInfo = `${objId}.spriteSheetInfo`
  const dirPath = type === 'unit' ? UNITS_IMAGES_PATH : ITEMS_IMAGES_PATH
  const infoPath = type === 'unit' ? UNITS_PATH : ITEMS_PATH

  const path = dirPath + GetJsonFileValue(infoPath, valuePath)
  const spriteSheetPath = GetJsonFileValue(infoPath, spriteSheetInfo)
  return <div className='vflex' style={{ alignItems: 'center' }}>
    <SpriteViewer path={path} spriteSheetPath={spriteSheetPath ? (dirPath + spriteSheetPath) : undefined} />
    
    <FileSelector
      placeholder='Image file'
      filesSourcePath={dirPath}
      filePath={infoPath}
      fileType='binary'
      valuePath={valuePath}
    />
    <FileSelector
      placeholder='Spritesheet info'
      filesSourcePath={dirPath}
      filePath={infoPath}
      fileType='json'
      valuePath={spriteSheetInfo}
    />
    {spriteSheetPath &&
      <button onClick={() => SortSprites(dirPath + spriteSheetPath)}>Sort sprites</button>
    }
  </div>
}

export default observer(ObjectImage)