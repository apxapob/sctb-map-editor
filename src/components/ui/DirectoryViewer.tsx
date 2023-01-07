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
      <FileItem tree={tree} root={root} level={level} fileSelector={fileSelector} />
    }
    {root && tree.isDirectory &&
      <>
        <div className='node' 
        style={{ paddingLeft: 2 + 18 * (level - 1) }}
        onClick={() => OpenFileTree(tree)}>
          {tree.isOpen ? '▾'  : '▸'}
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
        {tree.isOpen && <FileAdder path={tree.path} level={level} fileSelector={fileSelector} />}
      </>
    }
    {tree.isOpen && tree.isDirectory && nodes}
  </>
})

const FileItem = observer(({ tree, root, level, fileSelector }:FilesTreeProps) => {
  const isSelected = MapFiles.selectedScript === tree.path || MapFiles.selectedLang === tree.path
  return (
    <div className={`node ${ isSelected ? 'selected-file' : '' }`}
      style={{ paddingLeft: 4 + 18 * (level - 1) }}
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

  const createFile = () => {
    const fullpath = path + '\\' + inputVal
    if (showInput === 'file') {
      CreateFile(fullpath)
      fileSelector(fullpath)
    } else {
      CreateFolder(fullpath)
    }
    
    setShowInput('')
    setInputVal('')
  }

  return <div style={{ paddingLeft: 4 + 18 * level }} className="hflex file-adder">
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
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={ e => e.key === 'Enter' && createFile() }
        />
        <button onClick={createFile}>
          Add
        </button> 
        <button onClick={() => setShowInput('')}>
          Cancel
        </button> 
      </>
    }
    
  </div>
}
