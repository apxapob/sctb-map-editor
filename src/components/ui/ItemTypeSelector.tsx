import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import SelectItemType from '../../state/actions/SelectItemType'
import { MapFiles, ITEMS_PATH } from '../../state/MapFiles'
import { ItemType } from '../../types/types'
import { Selector } from './components/Selector'

const ItemTypeSelector = ():ReactElement => {
  const items = MapFiles.json[ITEMS_PATH] as {
    [itemType: string]: ItemType
  }
  
  const itemArray = React.useMemo(() => Object.values(items ?? {}), [items])

  React.useEffect(() => {
    SelectItemType(itemArray[0]?.type, false)
  }, [items])

  return <Selector items={itemArray.map(i => i.type)} onSelect={SelectItemType} />
}

export default observer(ItemTypeSelector)
