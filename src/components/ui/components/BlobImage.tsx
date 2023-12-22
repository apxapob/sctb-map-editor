import React, { useEffect, useRef, useState } from 'react'
import { MapFiles } from '../../../state/MapFiles'
import { observer } from 'mobx-react-lite'
import { SpriteSheetInfo } from '../../../types/types';
import './BlobImage.css'

type BlobImageProps = {
  path: string;
  cssClass?: string;
  containerCssClass?: string;
  spriteSheetPath?: string;
  direction?: number;
}

const getDir = (d:number, directions:number):{ dir:number, flip:boolean } => {
  switch(directions){
    case 1: return { dir: 0, flip: false }
    case 3: return d === 11 || d < 2 ? { dir: 0, flip: false } :
                               d < 5 ? { dir: 1, flip: false } :
                               d < 8 ? { dir: 2, flip: false } :
                                       { dir: 1, flip: true }
    case 4: return d === 11 || d < 2 ? { dir: 0, flip: false } :
                               d < 5 ? { dir: 1, flip: false } :
                               d < 8 ? { dir: 2, flip: false } :
                                       { dir: 3, flip: false }
    case 5: return d < 1 ? { dir: 0, flip: false } :
                   d < 3 ? { dir: 1, flip: false } :
                   d < 4 ? { dir: 2, flip: false } :
                   d < 6 ? { dir: 3, flip: false } :
                   d < 7 ? { dir: 4, flip: false } :
                   d < 9 ? { dir: 3, flip: true } :
                   d < 10 ? { dir: 2, flip: true } :
                            { dir: 1, flip: true }
    case 8: return d < 1 ? { dir: 0, flip: false } :
                   d < 3 ? { dir: 1, flip: false } :
                   d < 4 ? { dir: 2, flip: false } :
                   d < 6 ? { dir: 3, flip: false } :
                   d < 7 ? { dir: 4, flip: false } :
                   d < 9 ? { dir: 5, flip: false } :
                   d < 10 ? { dir: 6, flip: false } :
                            { dir: 7, flip: false }
    case 7: return d < 7 ? { dir: d, flip: false } :
                           { dir: 12-d, flip: true }
  }

  return { dir: d, flip: false }
}

const BlobImage = ({
  path, cssClass, containerCssClass, spriteSheetPath
}:BlobImageProps) => {
  const ref = useRef<HTMLImageElement>(null)
  const [error, setError] = useState('')

  const [frame, setFrame] = useState(0)
  const [direction, _setDirection] = useState(0)
  const setDirection = (d:number) => _setDirection((d+12) % 12)

  const buffer = MapFiles.binary[path]
  
  useEffect(() => {
    setError('')
    const img = ref?.current
    if (!buffer || !img) return
    
    const blob = new Blob([ buffer ])
    const url = URL.createObjectURL(blob)
    img.src = url
    return () => URL.revokeObjectURL(url)// So the Blob can be Garbage Collected
  }, [path])

  try{
    if(spriteSheetPath){
      const info = MapFiles.json[spriteSheetPath] as SpriteSheetInfo
      const { width, height, animationFramesNum: framesNum, directions } = info.packer
      const { dir, flip } = getDir(direction, directions)
      const { x, y, w, h, trimLeft, trimTop, trimOHeight, trimOWidth } = info.sprites[directions * (frame % framesNum) + dir]

      setTimeout(() => setFrame((frame+1) % framesNum), 125)
    
      return <div className={'blob-image-container'} style={{ width: trimOWidth, height: trimOHeight }}>
        <div style={{ transform: `scaleX(${flip ? -1 : 1})`, width:"100%", height:"100%" }}>
          {buffer 
            ? <img ref={ref} onError={() => setError('Invalid image')} 
              style={{
                top: trimTop-y,
                left: trimLeft-x,
                clipPath: `inset(${y}px ${width-x-w}px ${height-y-h}px ${x}px)`,
                position: 'absolute'
              }}
            />
            : 'No Image'
          }
        </div>
        {error}
        <div className='sprite-rotator'>
          <div className='rotator-buttons'>
            <button onClick={() => setDirection(direction+1)}>
            ↻
            </button>
            <span className='center-span' style={{ width: 40 }}>{direction === 0 ? 12 : direction}</span>
            <button onClick={() => setDirection(direction-1)}>
            ↺
            </button>
          </div>
        </div>
      </div>
    }
  } catch(e) {
    console.warn("Image error", e)
  }
  
  return <div className={containerCssClass ?? 'blob-image-container'}>
    {buffer 
      ? <img ref={ref} className={cssClass ?? 'blob-image'} onError={() => setError('Invalid image')} />
      : 'No Image'
    }
    {error}
  </div>
}

export default observer(BlobImage)
