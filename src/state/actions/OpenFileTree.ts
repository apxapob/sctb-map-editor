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

export const SelectLangFile = action(
  (path:string) => {
    MapFiles.selectedLang = path
  }
)
