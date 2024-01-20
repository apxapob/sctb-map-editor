import React from 'react'

export type SelectorProps = {
  value?: string;
  items: readonly string[];
  onSelect: (value:string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const Selector = (props:SelectorProps) => 
  <select
    value={props.value}
    disabled={!props.items || props.items.length === 0}
    style={{ width: 20, ...props.style }} 
    className={props.className}
    onChange={e => {
      props.onSelect(e.target.value)
      e.target.blur()
    }}>
    
    <option key="value">{props.value ?? ' '}</option>
    
    {props.items.filter(item => item !== props.value).map(
      item => <option key={item} value={item}>{item}</option>
    )}
  </select>
