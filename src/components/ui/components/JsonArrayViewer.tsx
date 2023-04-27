import React, { useState } from 'react'
import { Renamer } from './Renamer'

export type JsonArrayViewerProps = {
  items: string[];
  selectedItemId: string;
  selectUnit: (id:string) => void;
}

type ViewerItemProps = {
  itemId: string;
  selected: boolean;
  onClick: () => void;
  deleteItem: (id:string) => void;
}

const ViewerItem = ({ itemId, selected, onClick, deleteItem }:ViewerItemProps) => {
  const [isRenaming, setRenaming] = useState(false)

  const rename = (newName:string) => {
    setRenaming(false)
    if (newName === itemId) { return }
    console.log('!!! TODO: rename', itemId, 'to', newName)
  }

  if (isRenaming) {
    return <Renamer 
      style={{ marginLeft: 4 }}
      oldName={itemId}
      rename={rename}
    />
  }
  //TODO: delete and remove in context menu
  return <div className={`node ${ selected ? 'selected-item' : '' }`}
    onDoubleClick={() => setRenaming(true)}
    onClick={onClick}>
    {itemId}
    <button title='Delete' onClick={() => deleteItem(itemId)}>
      ✗
    </button>
  </div>
}

export const JsonArrayViewer = (
  { selectedItemId, items, selectUnit }:JsonArrayViewerProps
) => {
  const onKeyDown = (e:React.KeyboardEvent) => {
    const idx = items.indexOf(selectedItemId)
    if (idx === -1) { return }
    if (e.code === 'ArrowUp' && idx > 0) {
      selectUnit(items[ idx - 1 ])
      e.preventDefault()
      return 
    }
    if (e.code === 'ArrowDown' && idx < items.length - 1) {
      selectUnit(items[ idx + 1 ])
      e.preventDefault()
      return
    }
  }

  return <div className='dir-viewer-container' onKeyDown={e => onKeyDown(e)} tabIndex={0}>
    {items.map(itemId =>
      <ViewerItem 
        itemId={itemId} 
        key={itemId} 
        selected={itemId === selectedItemId}
        deleteItem={id => console.log('!!! TODO: delete', id)}
        onClick={() => selectUnit(itemId)} />
    )}
  </div>
}
