import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { OpenFileTree, SelectScriptFile } from '../../state/actions/OpenFileTree'
import { FilesTree, MapFiles, PathTreeType } from '../../state/MapFiles'
import './DirectoryViewer.css'

export type DirectoryViewerProps = {
  path: string;
}

const DirectoryViewer = ({ path }: DirectoryViewerProps):ReactElement => {
  return (
    <div className='dir-viewer-container'>
      <PathTree tree={FilesTree.nodes[path.replace('\\', '')]} 
        root={null} 
        level={0} />
    </div>
  )
}

export default observer(DirectoryViewer)

const PathTree = observer(({ tree, root, level }: {
  tree: PathTreeType;
  root: string | null;
  level: number;
}) => {
  const nodes = []
  for (const nodeKey in tree.nodes) {
    const node = tree.nodes[nodeKey]
    if (node === null) {
      nodes.push(
        <div className='node' style={{ paddingLeft: 18 * level }}>
          {nodeKey}
        </div>
      )
    } else {
      nodes.push(
        <PathTree tree={node} root={nodeKey} level={level + 1} key={root + nodeKey + level} />
      )
    }
  }
  return <>
    {root && nodes.length === 0 &&
      <div className={`node ${ MapFiles.selectedScript === tree.path ? 'selected-file' : '' }`}
      style={{ paddingLeft: 18 * (level - 1) }}
      onClick={() => SelectScriptFile(tree.path)}>
        {root}
      </div>
    }
    {root && nodes.length > 0 &&
      <div className='node' 
        style={{ paddingLeft: 18 * (level - 1) }}
        onClick={() => OpenFileTree(tree)}>
        {tree.isOpen ? '▾'  : '▸'}
        {root}
      </div>
    }
    {tree.isOpen && nodes}
  </>
})
