import React, { ReactElement } from 'react'

export type SelectorProps = {
  items: string[];
  onSelect: (value:string) => void;
}

export const Selector = (props:SelectorProps):ReactElement => {
  return (
    <select style={{ width:20 }} className="btnArrow"
      onChange={e => {
        props.onSelect(e.target.value)
        e.target.blur()
      }}>
      {props.items.map(
        item => <option key={item} value={item}>{item}</option>
      )}
    </select>
  )
}
