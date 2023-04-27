import React from 'react'

export type SelectorProps = {
  items: string[];
  onSelect: (value:string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const Selector = (props:SelectorProps) => 
  <select
    style={{ width: 20, ...props.style }} 
    value={props.placeholder}
    className={props.placeholder ? '' : 'btnArrow'}
    onChange={e => {
      props.onSelect(e.target.value)
      e.target.blur()
    }}>
    {props.placeholder &&
      <option key="placeholder">{props.placeholder}</option>
    }
    {props.items.map(
      item => <option key={item} value={item}>{item}</option>
    )}
  </select>
