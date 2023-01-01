import { action } from 'mobx'
import { MapFiles, PathTreeType } from '../MapFiles'

export const OpenFileTree = action(
  (tree:PathTreeType) => {
    tree.isOpen = !tree.isOpen
  }
)

export const SelectScriptFile = action(
  (tree:PathTreeType) => {
    MapFiles.selectedScript = tree.path
  }
)
