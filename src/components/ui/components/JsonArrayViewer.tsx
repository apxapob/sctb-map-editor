import React, { useState } from 'react'
import { Renamer } from './Renamer'
import ShowMenu from '../../../state/actions/ShowMenu'

export type JsonArrayViewerProps = {
  deleteItem: (id:string) => void;
  renameItem: (id:string, newName:string) => void;
  items: string[];
  selectedItemId: string;
  selectUnit: (id:string) => void;
}

type ViewerItemProps = {
  itemId: string;
  selected: boolean;
  onClick: () => void;
  deleteItem: (id:string) => void;
  renameItem: (id:string, newName:string) => void;
}

const ViewerItem = ({ itemId, selected, onClick, deleteItem, renameItem }:ViewerItemProps) => {
  const [isRenaming, setRenaming] = useState(false)
  const startRenaming = () => setRenaming(true)

  const contextMenuItems = [{
    title: 'Rename', 
    callback: startRenaming
  }, {
    title: 'Delete', 
    callback: () => deleteItem(itemId)
  }]

  const rename = (newName:string) => {
    setRenaming(false)
    if (newName === itemId) { return }
    renameItem(itemId, newName)
  }

  if (isRenaming) {
    return <Renamer 
      style={{ marginLeft: 4 }}
      oldName={itemId}
      rename={rename}
    />
  }
  
  return <div 
    className={`node ${ selected ? 'selected-item' : '' }`}
    onDoubleClick={startRenaming}
    onContextMenu={e => {
      onClick()
      ShowMenu(e, contextMenuItems)
    }}
    onClick={onClick}
  >
    {itemId}
  </div>
}

export const JsonArrayViewer = (
  { selectedItemId, items, selectUnit, deleteItem, renameItem }:JsonArrayViewerProps
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
        renameItem={renameItem}
        deleteItem={deleteItem}
        onClick={() => selectUnit(itemId)} />
    )}
  </div>
}
