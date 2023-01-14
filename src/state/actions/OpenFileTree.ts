import { action } from 'mobx'
import { MapFiles, PathTreeType } from '../MapFiles'
import SaveChanges from './SaveChanges'

export const OpenFileTree = action(
  (tree:PathTreeType) => {
    tree.isOpen = !tree.isOpen
  }
)

export const SelectScriptFile = action(
  (path:string) => {
    if (!SaveChanges()) { return }
    MapFiles.selectedScript = path
  }
)

export const SelectLangFile = action(
  (path:string) => {
    if (!SaveChanges()) { return }
    MapFiles.selectedLang = path
  }
)

export const SelectParticlesFile = action(
  (path:string) => {
    if (!SaveChanges()) { return }
    MapFiles.selectedParticlesFile = path
  }
)

