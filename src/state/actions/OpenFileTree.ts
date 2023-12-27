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

export const SelectFieldFile = action(
  (path:string) => {
    MapFiles.selectedField = path
  }
)

export const SelectLangFile = action(
  (path:string) => {
    MapFiles.selectedLang = path
  }
)

export const SelectParticlesFile = action(
  (path:string) => {
    MapFiles.selectedParticlesFile = path
  }
)

export const SelectFile = action(
  (path:string) => {
    MapFiles.selectedFile = path
  }
)
