import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { OpenFileTree } from '../../state/actions/OpenFileTree'
import { CreateFile, CreateFolder } from '../../state/actions/SaveChanges'
import { FilesTree, MapFiles, PathTreeType } from '../../state/MapFiles'
import './DirectoryViewer.css'

export type DirectoryViewerProps = {
  path: string;
  fileSelector: (path:string) => void;
}

const DirectoryViewer = ({ path, fileSelector }: DirectoryViewerProps):ReactElement => {
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

const PathTree = observer(({ tree, root, level, fileSelector }: {
  tree: PathTreeType;
  root: string | null;
  level: number;
  fileSelector: (path:string) => void;
}) => {
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
  
  const isSelected = MapFiles.selectedScript === tree.path || MapFiles.selectedLang === tree.path
  return <>
    {root && nodes.length === 0 &&
      <div className={`node ${ isSelected ? 'selected-file' : '' }`}//make a component
      style={{ paddingLeft: 4 + 18 * (level - 1) }}
      onClick={() => fileSelector(tree.path)}>
        {root}
      </div>
    }
    {root && nodes.length > 0 &&
      <>
        <div className='node' 
        style={{ paddingLeft: 2 + 18 * (level - 1) }}
        onClick={() => OpenFileTree(tree)}>
          {tree.isOpen ? '▾'  : '▸'}
          {root}
        </div>
        {tree.isOpen && <FileAdder path={tree.path} level={level} fileSelector={fileSelector} />}
      </>
    }
    {tree.isOpen && nodes}
  </>
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
        <input value={inputVal} onChange={e => setInputVal(e.target.value)} />
        <button onClick={createFile}>
          Add
        </button> 
      </>
    }
    
  </div>
}
