import { action } from 'mobx'
import { PathTreeType } from '../MapFiles'

export const OpenFileTree = action(
  (tree:PathTreeType) => {
    tree.isOpen = !tree.isOpen
  }
)
