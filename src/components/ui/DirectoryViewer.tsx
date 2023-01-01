import { observer } from 'mobx-react-lite'
import React, { ReactElement } from 'react'
import { OpenFileTree } from '../../state/actions/OpenFileTree'
import { FilesTree, PathTreeType } from '../../state/MapFiles'
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
    {root &&
      <div className='node' 
        style={{ paddingLeft: 18 * (level - 1) }}
        onClick={() => OpenFileTree(tree)}>
        {nodes.length === 0 
          ? '' 
          : tree.isOpen
            ? '▾' 
            : '▸'
        }
        {root}
      </div>
    }
    {tree.isOpen && nodes}
  </>
})
