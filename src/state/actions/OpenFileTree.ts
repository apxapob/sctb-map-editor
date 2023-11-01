import { action } from 'mobx'
import { MapFiles, PathTreeType } from '../MapFiles'
import SaveChanges from './SaveChanges'

export const OpenFileTree = action(
  (tree:PathTreeType) => {
    tree.isOpen = !tree.isOpen
  }
)

//TODO: remove copy pasted code
export const SelectScriptFile = action(
  (path:string) => {
    if (!SaveChanges()) { return }
    MapFiles.selectedScript = path
  }
)

export const SelectFieldFile = action(
  (path:string) => {
    if (!SaveChanges()) { return }
    MapFiles.selectedField = path
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

export const SelectImageFile = action(
  (path:string) => {
    if (!SaveChanges()) { return }
    MapFiles.selectedImageFile = path
  }
)
