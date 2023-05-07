import './Tab.css'
import React from 'react'
import { SelectTab } from '../../state/actions/OpenPanel'
import { TabType } from '../../types/types'
import { observer } from 'mobx-react-lite'
import { JsonMode, TabsState } from '../../state/ToolState'
import ShowMenu from '../../state/actions/ShowMenu'
import ToggleJsonMode from '../../state/actions/ToggleJsonMode'
import { CancelUnsavedData } from '../../state/actions/UpdateText'

export type TabProps = {
  title: TabType;
  selected: boolean;
}

const Tab = ({ title, selected }:TabProps) => 
  <div 
    className={ `tab ${selected ? '' : 'not-'}selected-tab` } 
    onClick={() => SelectTab(title)}
    onContextMenu={e => title !== 'Scripts' && title !== 'Particles' &&
      ShowMenu(e, [
        { title: 'Discard changes', callback: () => CancelUnsavedData(title) },
        { title: 'Json mode on/off', callback: () => ToggleJsonMode(title) }
      ])
    }
  >
    {title}{JsonMode[title] ? '(JSON)' : ''}{TabsState[title] && '*'}
  </div>

export default observer(Tab)
