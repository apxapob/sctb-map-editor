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

export type TabProps = {
  tab: TabType;
  selected: boolean;
}

const isTabUnsaved = (tab: TabType) => {
  if(tab == 'Files') return false
  
  const directory = getDirPath(tab)
  if(directory){
    for(const file in UnsavedFiles){
      if(file.startsWith(directory))return true
    }
  }
  return !!UnsavedFiles[getFilePath(tab)]
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
