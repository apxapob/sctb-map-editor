import './Tab.css'
import React, { ReactElement } from 'react'
import { SelectTab } from '../../state/actions/OpenPanel'
import { TabType } from '../../types/types'

export type TabProps = {
  title: TabType;
  selected: boolean;
}

export const Tab = (props:TabProps):ReactElement => {
  return <div className={ `tab ${props.selected ? '' : 'not-'}selected` } onClick={() => SelectTab(props.title)}>
    {props.title}
  </div>
}
