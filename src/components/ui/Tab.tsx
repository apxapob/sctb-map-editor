import './Tab.css'
import React from 'react'
import { SelectTab } from '../../state/actions/OpenPanel'
import { TabType } from '../../types/types'
import { observer } from 'mobx-react-lite'
import { TabsState } from '../../state/ToolState'

export type TabProps = {
  title: TabType;
  selected: boolean;
}

const Tab = (props:TabProps) => {
  return <div className={ `tab ${props.selected ? '' : 'not-'}selected-tab` } onClick={() => SelectTab(props.title)}>
    {props.title}{TabsState[props.title] && '*'}
  </div>
}

export default observer(Tab)
