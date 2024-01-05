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

const getSpriteDir = (unitDir:number, directions:number):{ dir:number, flip:boolean } => {
  switch(directions){
    case 1: return { dir: 0, flip: unitDir > 5 }
    case 3: return unitDir === 11 || unitDir < 2 ? { dir: 0, flip: false } :
                                     unitDir < 5 ? { dir: 1, flip: false } :
                                     unitDir < 8 ? { dir: 2, flip: false } :
                                                   { dir: 1, flip: true }
    case 4: return unitDir === 11 || unitDir < 2 ? { dir: 0, flip: false } :
                                     unitDir < 5 ? { dir: 1, flip: false } :
                                     unitDir < 8 ? { dir: 2, flip: false } :
                                                   { dir: 3, flip: false }
    case 5: return unitDir < 1 ? { dir: 0, flip: false } :
                   unitDir < 3 ? { dir: 1, flip: false } :
                   unitDir < 4 ? { dir: 2, flip: false } :
                   unitDir < 6 ? { dir: 3, flip: false } :
                   unitDir < 7 ? { dir: 4, flip: false } :
                   unitDir < 9 ? { dir: 3, flip: true } :
                   unitDir < 10 ? { dir: 2, flip: true } :
                                  { dir: 1, flip: true }
    case 8: return unitDir < 1 ? { dir: 0, flip: false } :
                   unitDir < 3 ? { dir: 1, flip: false } :
                   unitDir < 4 ? { dir: 2, flip: false } :
                   unitDir < 6 ? { dir: 3, flip: false } :
                   unitDir < 7 ? { dir: 4, flip: false } :
                   unitDir < 9 ? { dir: 5, flip: false } :
                   unitDir < 10 ? { dir: 6, flip: false } :
                                  { dir: 7, flip: false }
    case 7: return unitDir < 7 ? { dir: unitDir, flip: false } :
                                 { dir: 12-unitDir, flip: true }
  }

  return { dir: unitDir, flip: false }
}

const BlobImage = ({
  path, cssClass, containerCssClass, spriteSheetPath
}:BlobImageProps) => {
  const ref = useRef<HTMLImageElement>(null)
  const [error, setError] = useState('')

  const [frame, setFrame] = useState(0)
  const [maxW, setMaxW] = useState(0)
  const [maxH, setMaxH] = useState(0)
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

  useEffect(() => {
    if(!spriteSheetPath){ return }
    const info = MapFiles.json[spriteSheetPath] as SpriteSheetInfo
    const { animationFramesNum: framesNum, directions } = info.packer
    let mW = 0, mH = 0
    const { dir } = getSpriteDir(direction, directions)
    for(let i = 0; i < framesNum; i++){
      const { w, h } = info.sprites[directions * i + dir]
      mW = Math.max(mW, w)
      mH = Math.max(mH, h)
    }
    setMaxW(mW)
    setMaxH(mH)
  }, [spriteSheetPath, direction])

  try{
    if(spriteSheetPath){
      const info = MapFiles.json[spriteSheetPath] as SpriteSheetInfo
      const { width, height, animationFramesNum: framesNum, directions } = info.packer
      const { dir, flip } = getSpriteDir(direction, directions)
      const { x, y, w, h } = info.sprites[directions * (frame % framesNum) + dir]

      setTimeout(() => setFrame((frame+1) % framesNum), 100)
    
      return <div className={'blob-image-container'} style={{ width: maxW, height: maxH }}>
        <div style={{ transform: `scaleX(${flip ? -1 : 1})`, width:"100%", height:"100%" }}>
          {buffer 
            ? <img ref={ref} onError={() => setError('Invalid image')} 
              style={{
                top: (maxH-h)/2-y,
                left: (maxW-w)/2-x,
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
