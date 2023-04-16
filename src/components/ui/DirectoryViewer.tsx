import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { OpenFileTree } from '../../state/actions/OpenFileTree'
import { CreateFile, CreateFolder } from '../../state/actions/SaveChanges'
import { FilesTree, MapFiles, PathTreeType } from '../../state/MapFiles'
import { SendCommand } from '../../utils/messenger'
import './DirectoryViewer.css'
import ShowMenu from '../../state/actions/ShowMenu'

export type DirectoryViewerProps = {
  path: string;
  fileSelector: (path:string) => void;
}

const DirectoryViewer = ({ path, fileSelector }: DirectoryViewerProps):ReactElement => {
  //<FileAdder path={path.replace('\\', '')} level={0} fileSelector={fileSelector} />
  return (
    <div className='dir-viewer-container'>
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
  const [adder, setAdder] = React.useState<'file'|'folder'|null>(null)

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

  const getMenuItems = (path:string) => [
    { 
      title: 'Delete', 
      callback: () => SendCommand({
        command: 'DELETE',
        path: path
      })
    },
    { 
      title: 'New file', 
      callback: () => setAdder('file')
    },
    { 
      title: 'New folder', 
      callback: () => setAdder('folder')
    },
  ]
  
  return <>
    {root && !tree.isDirectory &&
      <FileItem tree={tree} root={root} level={level} fileSelector={fileSelector} />
    }
    {root && tree.isDirectory &&
      <>
        <div className='node' 
          style={{ paddingLeft: 2 + 18 * (level - 1) }}
          onContextMenu={
            e => ShowMenu(e, getMenuItems(tree.path))
          }
          onClick={() => OpenFileTree(tree)}>
          {tree.isOpen ? '▾📂'  : '▸📁'}
          {root}
        </div>
        
        {tree.isOpen && adder !== null &&
          <FileAdder
            path={tree.path} 
            level={level} 
            fileSelector={fileSelector} 
            add={adder} 
            reset={() => setAdder(null)}
          />
        }
      </>
    }
    {tree.isOpen && tree.isDirectory && nodes}
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
  path, level, fileSelector, add, reset
}:{ 
  path: string;
  level: number;
  add: 'file'|'folder';
  fileSelector: (path:string) => void;
  reset: () => void;
}) => {
  const [inputVal, setInputVal] = React.useState<string>('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [add])

  const createFile = () => {
    const fullpath = path + '\\' + inputVal
    if (add === 'file') {
      CreateFile(fullpath)
      fileSelector(fullpath)
    } else {
      CreateFolder(fullpath)
    }
    
    reset()
  }

  return <>
    <div style={{ paddingLeft: 4 + 18 * level }} className="file-adder">  
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
      <button onClick={() => reset()}>
        ✗
      </button>
    </div>
  </>
}
