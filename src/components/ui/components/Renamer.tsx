import React from 'react'

type RenamerProps = {
  style?: React.CSSProperties;
  oldName: string;
  rename: (newName:string) => void;
}

export const Renamer = ({ style, oldName, rename }:RenamerProps) => {
  const [newName, setNewName] = React.useState<string>(oldName)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
    const endIdx = (oldName || '').lastIndexOf('.')
    inputRef.current?.setSelectionRange(0, endIdx > 0 ? endIdx : Number.MAX_SAFE_INTEGER)
  }, [])

  return <div className="file-adder">
    <input
      style={style}
      value={newName} ref={inputRef} 
      onBlur={() => rename(oldName)}
      onChange={e => setNewName(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') { rename(newName) }
        if (e.key === 'Escape') { rename(oldName) }
      }}
    />
    <button onMouseDown={() => rename(newName)}>
      ✓
    </button>
    <button onClick={() => rename(oldName)}>
      ✗
    </button>
  </div>
}
