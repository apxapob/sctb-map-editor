import { observable } from 'mobx'
import { TabType } from '../types/types'

export const UNITS_PATH = 'units.json'
export const UPGRADES_PATH = 'upgrades.json'
export const BUFFS_PATH = 'buffs.json'
export const INFO_PATH = 'info.json'
export const TEXTS_PATH = 'locales\\'
export const SCRIPTS_PATH = 'scripts\\'
export const PARTICLES_PATH = 'particles\\'

export const getFilePath = (tab:TabType) => {
  switch (tab) {
    case 'Buffs':
      return BUFFS_PATH
    case 'Units':
      return UNITS_PATH
    case 'Map':
      return INFO_PATH
    case 'Upgrades':
      return UPGRADES_PATH
    case 'Texts':
      return MapFiles.selectedLang
    case 'Scripts':
      return MapFiles.selectedScript
    case 'Particles':
      return MapFiles.selectedParticlesFile
  }
  return ''
}

export const getDirPath = (tab:TabType) => {
  switch (tab) {
    case 'Texts':
      return TEXTS_PATH
    case 'Scripts':
      return SCRIPTS_PATH
    case 'Particles':
      return PARTICLES_PATH
  }
  return ''
}

export const MapFiles:{
  binary: {
    [filename: string]: number;
  };
  text: {
    [filename: string]: string;
  };
  json: {
    [filename: string]: object;
  };
  lastLoadedFile: string;
  progress: number;
  status: 'Loaded' | 'Loading' | 'Error' | null;
  error: string | null;
  selectedLang: string;
  selectedScript: string;
  selectedParticlesFile: string;
} = observable({
  binary: {},
  text: {},
  json: {},
  lastLoadedFile: '',
  progress: 0,
  status: null,
  error: null,
  selectedLang: '',
  selectedScript: '',
  selectedParticlesFile: ''
})

export type PathTreeType = {
  isOpen: boolean;
  isDirectory: boolean;
  path: string;
  nodes: {
    [index: string]: PathTreeType;
  }
}

export const FilesTree: PathTreeType = observable({
  isOpen: true,
  isDirectory: true,
  path: '',
  nodes: {}
})
