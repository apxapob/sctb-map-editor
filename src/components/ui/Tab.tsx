import './Tab.css'
import React from 'react'
import { SelectTab } from '../../state/actions/SelectTab'
import { TabType } from '../../types/types'
import { observer } from 'mobx-react-lite'
import { UnsavedFiles } from '../../state/ToolState'
import ShowMenu from '../../state/actions/ShowMenu'
import { CancelUnsavedData } from '../../state/actions/UpdateText'
import SaveChanges from '../../state/actions/SaveChanges'

export type TabProps = {
  title: TabType;
  selected: boolean;
}

const Tab = ({ title, selected }:TabProps) => 
  <div 
    className={ `tab ${selected ? '' : 'not-'}selected-tab` } 
    onClick={() => SelectTab(title)}
    onContextMenu={e =>
      ShowMenu(e, [
        { title: 'Discard changes', callback: () => CancelUnsavedData(title) },
        { title: 'Save changes', callback: () => SaveChanges(title) }
      ])
    }
  >
    {title}{UnsavedFiles[title] && '*'}
  </div>

export default observer(Tab)
