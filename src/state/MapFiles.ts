import { observable } from 'mobx'
import { JSONObject, TabType } from '../types/types'

export const TILES_IMAGES_PATH = 'img/tiles/'
export const UNITS_PATH = 'units.json'
export const UNITS_IMAGES_PATH = 'img/units/'
export const ITEMS_PATH = 'items.json'
export const ITEMS_IMAGES_PATH = 'img/items/'
export const SKILLS_PATH = 'skills.json'
export const UPGRADES_PATH = 'upgrades.json'
export const BUFFS_PATH = 'buffs.json'
export const INFO_PATH = 'info.json'
export const FIELD_PATH = 'field.json'
export const TEXTS_PATH = 'locales/'
export const SCRIPTS_PATH = 'scripts/'
export const PARTICLES_PATH = 'particles/'

export const getFilePath = (tab:TabType) => {
  switch (tab) {
    case 'Buffs':
      return BUFFS_PATH
    case 'Units':
      return UNITS_PATH
    case 'Items':
      return ITEMS_PATH
    case 'Skills':
      return SKILLS_PATH
    case 'Map':
      return INFO_PATH
    case 'Upgrades':
      return UPGRADES_PATH
    case 'Field':
      return FIELD_PATH
    case 'Texts':
      return MapFiles.selectedLang
    case 'Scripts':
      return MapFiles.selectedScript
    case 'Files':
      return MapFiles.selectedFile
    case 'Particles':
      return MapFiles.selectedParticlesFile
  }
}

export const getDirPath = (tab:TabType) => {
  switch (tab) {
    case 'Texts':
      return TEXTS_PATH
    case 'Scripts':
      return SCRIPTS_PATH
    case 'Particles':
      return PARTICLES_PATH
    case 'Units':
      return UNITS_IMAGES_PATH
    case 'Items':
      return ITEMS_IMAGES_PATH
  }
  return ''
}

export const MapFiles:{
  binary: {
    [filename: string]: Uint8Array;
  };
  text: {
    [filename: string]: string;
  };
  json: {
    [filename: string]: JSONObject;
  };
  status: 'Loaded' | 'Loading' | 'Error' | null;
  error: string | null;
  selectedLang: string;
  selectedScript: string;
  selectedParticlesFile: string;
  selectedFile: string;
} = observable({
  binary: {},
  text: {},
  json: {},
  status: null,
  error: null,
  selectedLang: '',
  selectedScript: '',
  selectedParticlesFile: '',
  selectedFile: ''
})

export type PathTreeType = {
  isOpen: boolean;
  isDirectory: boolean;
  isGameFile?: boolean;
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
