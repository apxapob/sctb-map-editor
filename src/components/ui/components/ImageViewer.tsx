import React, { useEffect, useRef, useState } from 'react'
import { MapFiles } from '../../../state/MapFiles'
import { observer } from 'mobx-react-lite'

type ImageViewerProps = {
  path: string;
  cssClass?: string;
  containerCssClass?: string;
}

const ImageViewer = ({
  path, cssClass, containerCssClass
}:ImageViewerProps) => {
  const ref = useRef<HTMLImageElement>(null)
  const [error, setError] = useState('')

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
  
  return <div className={containerCssClass ?? 'blob-image-container'}>
    {buffer 
      ? <img ref={ref} className={cssClass ?? 'blob-image'} onError={() => setError('Invalid image')} />
      : 'No Image'
    }
    {error}
  </div>
}

export default observer(ImageViewer)
