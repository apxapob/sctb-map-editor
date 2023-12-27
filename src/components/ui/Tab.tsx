import './Tab.css'
import React from 'react'
import { SelectTab } from '../../state/actions/SelectTab'
import { TabType } from '../../types/types'
import { observer } from 'mobx-react-lite'
import { UnsavedFiles } from '../../state/ToolState'
import ShowMenu from '../../state/actions/ShowMenu'
import { CancelUnsavedData } from '../../state/actions/UpdateText'
import SaveChanges from '../../state/actions/SaveChanges'
import { getDirPath, getFilePath } from '../../state/MapFiles'
import { toJS } from 'mobx'

export type TabProps = {
  tab: TabType;
  selected: boolean;
}

const isTabUnsaved = (tab: TabType) => {
  if(tab == 'Files') return false
  
  const dir = getDirPath(tab)
  if(dir){
    for(const file in UnsavedFiles){
      if(file.startsWith(dir))return true
    }
  } else {
    return !!UnsavedFiles[getFilePath(tab)]
  }
  return false
}

const Tab = ({ tab, selected }:TabProps) => 
  <div
    className={ `tab ${selected ? '' : 'not-'}selected-tab` } 
    onClick={() => SelectTab(tab)}
    onContextMenu={e =>
      ShowMenu(e, [
        { title: 'Discard changes', callback: () => CancelUnsavedData(tab) },
        { title: 'Save changes', callback: () => SaveChanges(tab) }
      ])
    }
  >
    {tab}{isTabUnsaved(tab) && '*'}
  </div>

export default observer(Tab)
