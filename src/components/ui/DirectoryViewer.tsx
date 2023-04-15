import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { OpenFileTree } from '../../state/actions/OpenFileTree'
import { CreateFile, CreateFolder } from '../../state/actions/SaveChanges'
import { FilesTree, MapFiles, PathTreeType } from '../../state/MapFiles'
import { SendCommand } from '../../utils/messenger'
import './DirectoryViewer.css'

export type DirectoryViewerProps = {
  path: string;
  fileSelector: (path:string) => void;
}

const DirectoryViewer = ({ path, fileSelector }: DirectoryViewerProps):ReactElement => {
  return (
    <div className='dir-viewer-container'>
      <FileAdder path={path.replace('\\', '')} level={0} fileSelector={fileSelector} />
      <PathTree
        fileSelector={fileSelector}
        tree={FilesTree.nodes[path.replace('\\', '')]} 
        root={null} 
        level={0} 
      />
    </div>
  )
}

export default observer(DirectoryViewer)

type FilesTreeProps = {
  tree: PathTreeType;
  root: string | null;
  level: number;
  fileSelector: (path:string) => void;
}

const PathTree = observer(({ tree, root, level, fileSelector }:FilesTreeProps) => {
  if (!tree) {
    return null
  }
  const nodes = []
  for (const nodeKey in tree.nodes) {
    const node = tree.nodes[nodeKey]
    
    nodes.push(
      <PathTree 
        tree={node} 
        root={nodeKey} 
        level={level + 1} 
        key={root + nodeKey + level} 
        fileSelector={fileSelector}
      />
    )
  }
  
  return <>
    {root && !tree.isDirectory &&
      <>
        <FileItem tree={tree} root={root} level={level} fileSelector={fileSelector} />
        <br />
      </>
    }
    {root && tree.isDirectory &&
      <>
        <div className='node' 
        style={{ paddingLeft: 2 + 18 * (level - 1) }}
        onContextMenu={() => OpenFileTree(tree)}
        onClick={() => OpenFileTree(tree)}>
          {tree.isOpen ? '▾📂'  : '▸📁'}
          {root}
          <span className='delete-file-icon' onClick={e => {
            e.stopPropagation()
            SendCommand({
              command: 'DELETE',
              path: tree.path
            })
          }}>
            🗑️
          </span>
        </div>
        
        {tree.isOpen && 
          <>
            <br />
            <FileAdder path={tree.path} level={level} fileSelector={fileSelector} />
          </>
        }
      </>
    }
    {tree.isOpen && tree.isDirectory && nodes}
    {!tree.isOpen && tree.isDirectory &&
      <br />
    }
  </>
})

const FileItem = observer(({ tree, root, level, fileSelector }:FilesTreeProps) => {
  const isSelected = MapFiles.selectedScript === tree.path || 
                     MapFiles.selectedLang === tree.path || 
                     MapFiles.selectedParticlesFile === tree.path
  const [newName, setNewName] = React.useState<string|null>(null)

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
    const endIdx = (root || '').lastIndexOf('.')
    inputRef.current?.setSelectionRange(0, endIdx > 0 ? endIdx : Number.MAX_SAFE_INTEGER)
  }, [newName === null])

  const rename = () => SendCommand({
    command: 'RENAME',
    path: tree.path,
    newName: newName + ''
  })

  if (newName !== null) {
    return <div className="file-adder">
      <input
        style={{ marginLeft: 4 + 18 * (level - 1) }}
        value={newName} ref={inputRef} 
        onBlur={() => setNewName(null)}
        onChange={e => setNewName(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') { 
            rename()
            setNewName(null)
          }
          if (e.key === 'Escape') { setNewName(null) }
        }}
      />
      <button onMouseDown={rename}>
        ✓
      </button>
      <button onClick={() => setNewName(null)}>
        ✗
      </button>
    </div>
  }

  return (
    <div className={`node ${ isSelected ? 'selected-file' : '' }`}
      style={{ paddingLeft: 4 + 18 * (level - 1) }}
      onDoubleClick={() => setNewName(root)}
      onClick={() => fileSelector(tree.path)}>
      <span>
        {root}
      </span>
      <span className='delete-file-icon' onClick={e => {
        e.stopPropagation()
        SendCommand({
          command: 'DELETE',
          path: tree.path
        })
      }}>
        🗑️
      </span>
    </div>
  )
})

const FileAdder = ({
  path, level, fileSelector
}:{ 
  path: string;
  level: number; 
  fileSelector: (path:string) => void;
}) => {
  const [showInput, setShowInput] = React.useState<'file'|'folder'|''>('')
  const [inputVal, setInputVal] = React.useState<string>('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [showInput])

  const reset = () => {
    setShowInput('')
    setInputVal('')
  }

  const createFile = () => {
    const fullpath = path + '\\' + inputVal
    if (showInput === 'file') {
      CreateFile(fullpath)
      fileSelector(fullpath)
    } else {
      CreateFolder(fullpath)
    }
    
    reset()
  }

  return <>
    <div style={{ paddingLeft: 4 + 18 * level }} className="file-adder">
      {!showInput &&
        <>
          <button onClick={() => setShowInput('file')}>
            +File
          </button> 
          <button onClick={() => setShowInput('folder')}>
            +Folder
          </button> 
        </>
      }
      {showInput &&
        <>
          <input
            value={inputVal} ref={inputRef} 
            onBlur={reset}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { createFile() }
              if (e.key === 'Escape') { reset() }
            }}
          />
          <button onMouseDown={createFile}>
            ✓
          </button> 
          <button onClick={() => setShowInput('')}>
            ✗
          </button>
        </>
      }
    </div>
    <br />
  </>
}
