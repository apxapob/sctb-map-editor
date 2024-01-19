import { observer } from 'mobx-react-lite'
import React from 'react'
import { OpenFileTree, SelectFieldFile, SelectFile, SelectLangFile, SelectParticlesFile, SelectScriptFile } from '../../state/actions/OpenFileTree'
import { CreateFile, CreateFolder } from '../../state/actions/SaveChanges'
import { FilesTree, MapFiles, PathTreeType, SCRIPTS_PATH } from '../../state/MapFiles'
import { SendToElectron } from '../../utils/messenger'
import './DirectoryViewer.css'
import ShowMenu from '../../state/actions/ShowMenu'
import { EditorState, UnsavedFiles } from '../../state/ToolState'
import { Renamer } from './components/Renamer'
import { TabType } from '../../types/types'

export const fileSelectors: {
  [tab in TabType]?: (path:string) => void;
} = {
  'Field': SelectFieldFile,
  'Scripts': SelectScriptFile, 
  'Texts': SelectLangFile, 
  'Particles': SelectParticlesFile,
  'Files': SelectFile,
}

export type DirectoryViewerProps = {
  path: string;
}

type AdderType = 'file'|'folder'|null

const getFileMenuItems = (
  tree:PathTreeType,
  renameFile: () => void,
  setAdder: (val:AdderType) => void,
) => [
  {
    title: 'New file', 
    callback: () => setAdder('file')
  },
  {
    title: 'Add file', 
    callback: () => SendToElectron({
      command: 'ADD_FILE',
      path: tree.path.substring(0, tree.path.lastIndexOf("/")),
      editMode: true
    })
  },
  {
    title: 'New folder', 
    callback: () => setAdder('folder')
  },
  {
    title: 'Rename', 
    callback: () => renameFile()
  },
  {
    title: 'Delete', 
    callback: () => {
      SendToElectron({
        command: 'DELETE',
        path: tree.path,
        editMode: true
      })
      fileSelectors[EditorState.activeTab]?.('')
    }
  },
]

const getFolderMenuItems = (
  tree:PathTreeType,
  setAdder: (val:AdderType) => void,
  canDelete = true,
) => [
  {
    title: 'New file', 
    callback: () => setAdder('file')
  },
  {
    title: 'Add File', 
    callback: () => SendToElectron({
      command: 'ADD_FILE',
      path: tree.path,
      editMode: true
    })
  },
  {
    title: 'New folder', 
    callback: () => setAdder('folder')
  },
  canDelete && {
    title: 'Delete',
    callback: () => {
      SendToElectron({
        command: 'DELETE',
        path: tree.path,
        dirFiles: Object.keys(tree.nodes),
        editMode: true
      })
      fileSelectors[EditorState.activeTab]?.('')
    }
  },
]

const DirectoryViewer = ({ path }: DirectoryViewerProps) => {
  const [adder, setAdder] = React.useState<AdderType>(null)
  const mainTree:PathTreeType = {
    isOpen: true,
    isDirectory: true,
    path,
    nodes: path 
      ? FilesTree.nodes[path].nodes
      : FilesTree.nodes
  }

  const fileSelector = fileSelectors[EditorState.activeTab]
  if (!fileSelector) return null
  return (
    <div className='dir-viewer-container'
      onContextMenu={
        e => ShowMenu(e, getFolderMenuItems(mainTree, setAdder, false))
      }>
      {adder !== null &&
        <FileAdder
          path={mainTree.path} 
          level={0} 
          fileSelector={fileSelector} 
          add={adder} 
          reset={() => setAdder(null)}
        />
      }
      <PathTree
        fileSelector={fileSelector}
        tree={mainTree}
        level={0}
        setAdder={() => {}}
      />
    </div>
  )
}

export default observer(DirectoryViewer)

type FilesTreeProps = {
  tree: PathTreeType;
  root?: string;
  level: number;
  fileSelector: (path:string) => void;
  setAdder: (val:AdderType) => void;
}

const PathTree = observer(({ tree, root, level, fileSelector, setAdder }:FilesTreeProps) => {
  const [adder, _] = React.useState<AdderType>(null)
  if(tree.isDirectory || !setAdder){
    setAdder = _
  }
  
  if (!tree) { return null }
  
  const nodes = Object.keys(tree.nodes)
    .sort((key1, key2) => {
      const node1 = tree.nodes[key1]
      const node2 = tree.nodes[key2]
      if (node1.isDirectory && !node2.isDirectory) {
        return -1
      }
      if (!node1.isDirectory && node2.isDirectory) {
        return 1
      }

      return key1 > key2 ? 1 : -1
    })
    .map(nodeKey => 
      <PathTree
        tree={tree.nodes[nodeKey]}
        root={nodeKey} 
        level={level + 1}
        setAdder={setAdder}
        key={root + nodeKey + level} 
        fileSelector={fileSelector}
      />
    )
  
  return <>
    {root && !tree.isDirectory &&
      <FileItem 
        tree={tree} 
        root={root} 
        level={level} 
        fileSelector={fileSelector} 
        setAdder={setAdder}
      />
    }
    {tree.isDirectory &&
      <>
        {root &&
          <div className='node' 
            style={{ paddingLeft: 2 + 18 * (level - 1), color: tree.isGameFile ? 'cyan' : 'white' }}
            title={tree.isGameFile ? 'This folder belongs to the game, not to the map' : undefined}
            onContextMenu={e => {
              e.stopPropagation()
              ShowMenu(e, getFolderMenuItems(tree, setAdder))
            }}
            onClick={() => OpenFileTree(tree)}>
            {tree.isOpen ? '▾📂'  : '▸📁'}
            {root}
          </div>
        }
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

const isFileSelected = (path:string) => {
  switch(EditorState.activeTab){
    case 'Scripts': return MapFiles.selectedScript === path
    case 'Texts': return MapFiles.selectedLang === path
    case 'Particles': return MapFiles.selectedParticlesFile === path
    case 'Files': return MapFiles.selectedFile === path
    case 'Field': return MapFiles.selectedField === path
  }
  return false
}

const FileItem = observer(
  ({ tree, root, level, fileSelector, setAdder }:FilesTreeProps) => {
    const isSelected = isFileSelected(tree.path)
      
    const [isRenaming, setRenaming] = React.useState(false)

    const rename = (newName:string) => {
      setRenaming(false)
      if (newName === root) { return }
      SendToElectron({
        command: 'RENAME',
        path: tree.path,
        newName: newName + ''
      })
    }

    if (isRenaming) {
      return <Renamer 
        style={{ marginLeft: 4 + 18 * (level - 1) }}
        oldName={root ?? ''} 
        rename={rename}
      />
    }

    const startRenaming = () => setRenaming(true)

    return (
      <div className={`node ${ isSelected ? 'selected-item' : '' }`}
        style={{ paddingLeft: 4 + 18 * (level - 1), color: tree.isGameFile ? 'cyan' : 'white' }}
        title={tree.isGameFile ? 'This file belongs to the game, not to the map' : undefined}
        onDoubleClick={startRenaming}
        tabIndex={0}
        onContextMenu={e => {
          e.stopPropagation()
          ShowMenu(e, getFileMenuItems(tree, startRenaming, setAdder))
        }}
        onClick={() => fileSelector(tree.path)}>
        {root}{UnsavedFiles[tree.path] && '*'}
      </div>
    )
  }
)

const FileAdder = ({
  path, level, fileSelector, add, reset
}:{
  path: string;
  level: number;
  add: AdderType;
  fileSelector: (path:string) => void;
  reset: () => void;
}) => {
  const [inputVal, setInputVal] = React.useState<string>(
    add === 'folder' ? '' 
      : path.startsWith(SCRIPTS_PATH.replace('/', '')) ? '.hx' : '.json'
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.setSelectionRange(0, 0)
  }, [add])

  const createFile = () => {
    const fullpath = path + '/' + inputVal
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
        onChange={e => setInputVal(e.target.value.replaceAll(/[\\/:*?\"<>|]/gmi, ''))}
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
