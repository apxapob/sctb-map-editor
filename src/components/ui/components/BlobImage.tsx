import React, { useEffect, useRef, useState } from 'react'
import { MapFiles } from '../../../state/MapFiles'
import { observer } from 'mobx-react-lite'

type BlobImageProps = {
  path: string;
}

const BlobImage = ({
  path
}:BlobImageProps) => {
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

  return <div className='blob-image-container'>
    {buffer 
      ? <img ref={ref} className='blob-image' onError={() => setError('Invalid image')} />
      : 'No Image'
    }
    {error}
  </div>
}

export default observer(BlobImage)
