import './Tab.css'
import React, { ReactElement } from 'react'
import { SelectTab } from '../../state/actions/OpenPanel'
import { TabType } from '../../types/types'
import { observer } from 'mobx-react-lite'
import { TabsState } from '../../state/ToolState'

export type TabProps = {
  title: TabType;
  selected: boolean;
}

const Tab = (props:TabProps):ReactElement => {
  return <div className={ `tab ${props.selected ? '' : 'not-'}selected` } onClick={() => SelectTab(props.title)}>
    {props.title}{TabsState[props.title] && '*'}
  </div>
}

export default observer(Tab)
