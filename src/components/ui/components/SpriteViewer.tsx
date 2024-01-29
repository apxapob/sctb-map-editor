import React, { useEffect, useRef, useState } from 'react'
import { MapFiles } from '../../../state/MapFiles'
import { observer } from 'mobx-react-lite'
import { SpriteSheetInfo } from '../../../types/types';
import './SpriteViewer.css'
import SpriteSheetOptions from './SpriteSheetOptions';
import { PressedKeys } from '../../../state/PressedKeys';

type SpriteRotatorProps = {
  direction: number;
  setDirection: (dir:number) => void;
}

type SpriteViewerProps = {
  path: string;
  cssClass?: string;
  spriteSheetPath?: string;
  direction?: number;
}

const getSpriteDir = (objDir:number, directions:number):{ dir:number, flip:boolean } => {
  if(directions < 1)directions = 1
  if(directions > 12)directions = 12
  switch(directions){
    case 1: return { dir: 0, flip: objDir > 5 }
    case 3: return objDir === 11 || objDir < 2 ? { dir: 0, flip: false } :
                                     objDir < 5 ? { dir: 1, flip: false } :
                                     objDir < 8 ? { dir: 2, flip: false } :
                                                   { dir: 1, flip: true }
    case 4: return objDir === 11 || objDir < 2 ? { dir: 0, flip: false } :
                                     objDir < 5 ? { dir: 1, flip: false } :
                                     objDir < 8 ? { dir: 2, flip: false } :
                                                   { dir: 3, flip: false }
    case 5: return objDir < 1 ? { dir: 0, flip: false } :
                   objDir < 3 ? { dir: 1, flip: false } :
                   objDir < 4 ? { dir: 2, flip: false } :
                   objDir < 6 ? { dir: 3, flip: false } :
                   objDir < 7 ? { dir: 4, flip: false } :
                   objDir < 9 ? { dir: 3, flip: true } :
                   objDir < 10 ? { dir: 2, flip: true } :
                                  { dir: 1, flip: true }
    case 7: return objDir < 7 ? { dir: objDir, flip: false } :
                                 { dir: 12-objDir, flip: true }
  }

  return { dir: Math.floor(objDir * directions / 12), flip: false };
}

export const SpriteRotator = ({
  direction,
  setDirection
}:SpriteRotatorProps) => {
  const clockAngle = Math.PI * (direction - 3) / 6
  return <div className='sprite-rotator'>
    <button onClick={() => setDirection(direction+1)} style={{ marginRight: 24 }}>
    ↻
    </button>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" className='dir-clock'>
      <g stroke="white" strokeWidth="2" fill="none">
        <circle cx="14" cy="14" r="13"/>
        <line x1="14" y1="14" x2={14 + 14 * Math.cos(clockAngle)} y2={14 + 14 * Math.sin(clockAngle)} />
      </g>
    </svg>
    <button onClick={() => setDirection(direction-1)} style={{ marginLeft: 24 }}>
    ↺
    </button>
  </div>
}

const Hex = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 138" className='hex'>
  <path stroke="white" strokeWidth="4" fill="none" 
        d="M 1 74 L 64 11 L 191 11 L 255 74 L 191 137 L 64 137 L 1 74"
  />
</svg>

const SpriteViewer = ({
  path, cssClass, spriteSheetPath
}:SpriteViewerProps) => {
  const ref = useRef<HTMLImageElement>(null)
  const [error, setError] = useState('')

  const [frame, setFrame] = useState(0)
  const [maxW, setMaxW] = useState(0)
  const [maxH, setMaxH] = useState(0)
  const [direction, _setDirection] = useState(0)
  const setDirection = (d:number) => _setDirection((d+12) % 12)

  useEffect(() => {
    if(PressedKeys[69])setDirection(direction+1)
    if(PressedKeys[81])setDirection(direction-1)
  }, [PressedKeys[69], PressedKeys[81]])

  const buffer = MapFiles.binary[path]
  const info = MapFiles.json[spriteSheetPath ?? ''] as SpriteSheetInfo
  const directions = info?.packer?.directions || 1
  const framesNum = (info?.packer?.animationFramesNum ?? (info?.sprites?.length / directions)) || 1
  
  useEffect(() => {
    setError('')
    const img = ref?.current
    if (!buffer || !img) return
    
    const blob = new Blob([ buffer ])
    const url = URL.createObjectURL(blob)
    img.src = url
    return () => URL.revokeObjectURL(url)// So the Blob can be Garbage Collected
  }, [path, spriteSheetPath])

  useEffect(() => {
    if(!spriteSheetPath || !info){ return }
    
    let mW = 0, mH = 0
    const { dir } = getSpriteDir(direction, directions)
    for(let i = 0; i < framesNum; i++){
      const frameId = Math.min(info.sprites.length-1, directions * i + dir)
      const { w, h } = info.sprites[frameId]
      mW = Math.max(mW, w)
      mH = Math.max(mH, h)
    }
    setMaxW(mW)
    setMaxH(mH)
  }, [spriteSheetPath, direction, framesNum])

  if(!spriteSheetPath || !info || error || !buffer){
    return <div style={{ position: 'relative' }}>
      {buffer && <Hex />}
      {buffer 
        ? <img ref={ref} className={cssClass ?? 'blob-image'} onError={() => setError('Invalid image')} />
        : 'No Image'
      }
      {error}
    </div>
  }
  
  try{
    const { width, height } = info.packer
    const { dir, flip } = getSpriteDir(direction, directions)
    const frameId = Math.min(info.sprites.length-1, directions * (frame % framesNum) + dir)
    const { x, y, w, h } = info.sprites[frameId]

    const dir_width = Math.max(0.01, info.packer[`dir${dir+1}_width`] as number || 0.7)
    const scale = maxW / dir_width / 256
    const dir_dx = (info.packer[`dir${dir+1}_dx`] as number ?? 0) * scale * (flip ? -1 : 1)
    const dir_dy = ((info.packer[`dir${dir+1}_dy`] as number ?? 0) - 25) * scale
    
    setTimeout(() => setFrame((frame+1) % framesNum), 100)//bug here
    const totalScale = 256 / maxW * dir_width
    const totalW = maxW / dir_width
    const totalH = Math.max(138 / totalScale, maxH - dir_dy)
    return <>
      <div style={{
        marginTop: 16 + Math.max(0, 138 - totalScale * totalH),
        width: totalScale * totalW, 
        height: totalScale * totalH,
      }}>
        <div style={{ 
          position: 'relative', 
          width: totalW, 
          height: totalH,
          transform: `scale(${totalScale}) translate(${(totalW - totalW / totalScale)/2}px, ${(totalH - totalH / totalScale)/2}px)`
        }}>
          <Hex />
          <div className='sprite-image-container'
            style={{
              width: maxW, 
              height: maxH,
              transform: `translate(${dir_dx-maxW/2}px, ${dir_dy}px)`
            }}>
            <div style={{ 
              transform: `scaleX(${flip ? -1 : 1})`, 
              width:"100%", 
              height:"100%" 
            }}> 
              <img ref={ref} onError={() => setError('Invalid image')} 
                style={{
                  top: maxH-h-y,
                  left: (maxW-w)/2-x,
                  clipPath: `inset(${y}px ${width-x-w}px ${height-y-h}px ${x}px)`,
                  position: 'absolute'
                }}
              />  
            </div>
            {error}
          </div>
        </div>
      </div>
      <SpriteRotator setDirection={setDirection} direction={direction}/>
      <SpriteSheetOptions configPath={spriteSheetPath} dirNumber={dir}/>
    </>
  } catch(e:any) {
    setError(`Image error: ${e?.message}`)
  }
}

export default observer(SpriteViewer)
