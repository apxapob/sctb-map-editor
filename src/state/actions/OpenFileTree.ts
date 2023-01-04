import { action } from 'mobx'
import { MapFiles, PathTreeType } from '../MapFiles'

export const OpenFileTree = action(
  (tree:PathTreeType) => {
    tree.isOpen = !tree.isOpen
  }
)

export const SelectScriptFile = action(
  (path:string) => {
    MapFiles.selectedScript = path
  }
)
