import React, { useState } from 'react'
import './View.css'
import { observer } from 'mobx-react-lite'
import { BUFFS_PATH, MapFiles, ITEMS_PATH, ITEMS_IMAGES_PATH } from '../../state/MapFiles'
import JsonNumberInput from '../ui/components/JsonNumberInput'
import JsonArrayInput from '../ui/components/JsonArrayInput'
import { BuffsMap, ItemType, ItemsMap } from '../../types/types'
import { JsonArrayViewer } from '../ui/components/JsonArrayViewer'
import { AddJsonFileValue, DeleteJsonFileValue, RenameJsonFileValue, UpdateJsonFileValue } from '../../state/actions/UpdateText'
import JsonBoolInput from '../ui/components/JsonBoolInput'
import BlobImage from '../ui/components/BlobImage'
import SendToGame from '../../state/actions/SendToGame'
import { RenameEntity } from '../../state/actions/RenameActions'

type ItemsStatsEditorProps = {
  itemId: string;
}

const ItemImage = ({
  itemId
}:ItemsStatsEditorProps) => {
  return <BlobImage path={ITEMS_IMAGES_PATH + itemId + '.png'} />
}

const ItemsStatsEditor = ({
  itemId
}:ItemsStatsEditorProps) => {
  if (!itemId) return null
  
  const buffs = MapFiles.json[BUFFS_PATH] as BuffsMap
  const buffsArray = React.useMemo(() => Object.keys(buffs), [buffs])

  return <div className='vflex' style={{ padding: 6 }}>
    <span style={{ fontSize: 24, margin: '2px 0 6px 0' }}>
      {itemId}
    </span>
    <JsonBoolInput
      placeholder='Unpickable'
      title='Unpickable'
      filePath={ITEMS_PATH}
      valuePath={`${itemId}.unpickable`}
    />
    <JsonNumberInput
      placeholder='Invisibility power'
      title='Invisibility power'
      filePath={ITEMS_PATH}
      valuePath={`${itemId}.invisible`}
      isInteger={true}
      min={0}
    />

    <JsonArrayInput
      title='Buffs'
      filePath={ITEMS_PATH}
      valuePath={`${itemId}.buffs`}
      placeholder='buff'
      valuesSource={buffsArray}
    />
  </div>
}

const ItemsView = () => {
  const itemsMap = MapFiles.json[ITEMS_PATH] as ItemsMap
  const itemIds = Object.keys(itemsMap).sort()

  const [selectedItemId, selectItem] = useState<string>('')
  
  return <>
    <div className='view-container hflex' style={{ alignItems: 'normal' }}>
      <JsonArrayViewer 
        placeholder='Item'
        items={itemIds} 
        selectedItemId={selectedItemId} 
        selectItem={selectItem}
        renameItem={(oldName, newName) => {
          selectItem(newName)
          RenameEntity("item", oldName, newName)
        }}
        addItem={() => AddJsonFileValue<ItemType>(
          ITEMS_PATH, 
          'Item', 
          { type: '', buffs: [], unpickable: false, invisible: 0 },
          selectItem
        )}
        deleteItem={id => {
          selectItem('')
          DeleteJsonFileValue(ITEMS_PATH, id)
        }}
      />
      <div className='unit-container'>
        <ItemsStatsEditor itemId={selectedItemId} />
        {selectedItemId &&
          <ItemImage itemId={selectedItemId} />
        }
      </div>
    </div>
  </>
}

export default observer(ItemsView)
