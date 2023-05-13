import React, { useState } from 'react'
import { Renamer } from './Renamer'
import ShowMenu from '../../../state/actions/ShowMenu'
import { MenuItem } from '../../../state/MenuState'

export type JsonArrayViewerProps = {
  addItem: () => void;
  deleteItem: (id:string) => void;
  renameItem: (id:string, newName:string) => void;
  items: string[];
  selectedItemId: string;
  selectItem: (id:string) => void;
  placeholder: string;
}

type ViewerItemProps = {
  itemId: string;
  selected: boolean;
  menuItems: MenuItem[];
  onClick: () => void;
  deleteItem: (id:string) => void;
  renameItem: (id:string, newName:string) => void;
}

const ItemViewer = ({ itemId, selected, onClick, deleteItem, renameItem, menuItems }:ViewerItemProps) => {
  const [isRenaming, setRenaming] = useState(false)
  const startRenaming = () => setRenaming(true)

  const contextMenuItems = [{
    title: 'Rename', 
    callback: startRenaming
  }, {
    title: 'Delete', 
    callback: () => deleteItem(itemId)
  }, ...menuItems]

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
  { selectedItemId, items, selectItem, deleteItem, renameItem, placeholder, addItem }:JsonArrayViewerProps
) => {
  const onKeyDown = (e:React.KeyboardEvent) => {
    const idx = items.indexOf(selectedItemId)
    if (idx === -1) { return }
    if (e.code === 'ArrowUp' && idx > 0) {
      selectItem(items[ idx - 1 ])
      e.preventDefault()
      return 
    }
    if (e.code === 'ArrowDown' && idx < items.length - 1) {
      selectItem(items[ idx + 1 ])
      e.preventDefault()
      return
    }
  }

  const menuItems = [{
    title: 'Add ' + placeholder,
    callback: addItem
  }]

  return <div 
    className='dir-viewer-container' 
    onKeyDown={e => onKeyDown(e)} 
    tabIndex={0}
    onContextMenuCapture={e => ShowMenu(e, menuItems)}
  >
    {items.map(itemId =>
      <ItemViewer
        itemId={itemId}
        key={itemId}
        selected={itemId === selectedItemId}
        renameItem={renameItem}
        deleteItem={deleteItem}
        menuItems={menuItems}
        onClick={() => selectItem(itemId)} />
    )}
    <div onClick={addItem} className={'node'}>
      {'+Add ' + placeholder}
    </div>
  </div>
}
