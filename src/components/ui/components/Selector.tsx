import React from 'react'

export type SelectorProps = {
  value?: string;
  items: readonly string[];
  onSelect: (value:string) => void;
  style?: React.CSSProperties;
}

export const Selector = (props:SelectorProps) => 
  <select
    value={props.value}
    style={{ width: 20, ...props.style }} 
    className={props.value === undefined ? 'btnArrow' : ''}
    onChange={e => {
      props.onSelect(e.target.value)
      e.target.blur()
    }}>
    
    <option key="value">{props.value ?? ' '}</option>
    
    {props.items.filter(item => item !== props.value).map(
      item => <option key={item} value={item}>{item}</option>
    )}
  </select>
