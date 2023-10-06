export type JSONValue = string | number | boolean | JSONObject | JSONArray
export type JSONObject = { [x: string]: JSONValue; }
export type JSONArray = JSONValue[]

export type GameMessage = {
  method: 'init_complete' | 'mark_field_unsaved' | 'reset_units_buffs' | 'to_main_screen' |
          'reset_field' | 'create_map' | 'maps_list' | 'loading_start' | 'save_changes';
} | {
  method: 'to_electron';
  data: any;
} | {
  method: 'save_map' | 'saves_list' | 'save_file_loaded' | 'test_map';
  data: string;
} | {
  method: 'show_map';
  data: {
    mapId: string;
    isPlayMode: boolean;
  } 
} | {
  method: 'tool_updated';
  data: {[index: string]: number | string | boolean}
} | {
  method: 'change_tool';
  data: ToolStateType;
} | {
  method: 'keys_pressed';
  data: { 
    [key: string]: string;
  }
} | {
  method: 'load_text_file';
  data: {
    path: string;
    text: string;
    refresh: boolean;
    progress: number;
  }
} | {
  method: 'select_country_view';
  data: { countyId: number; }
} | {
  method: 'change_field_size';
  data: { size: number; }
} | {
  method: 'load_binary_file';
  data: {
    path: string;
    bytes: Uint8Array;
    progress: number;
  }
} | {
  method: 'text_file_updated';
  data: { path: string; text: string }
} | {
  method: 'selected_objects' | 'update_objects';
  data: (ItemDataType | UnitDataType)[];
} | {
  method: 'maps_list';
  data: string[];
};

export type ToolType = 
  'LandUp' | 
  'LandDown' | 
  'DeleteTiles' |
  'CreateTiles' |
  'CreateItems' |
  'CreateUnits' |
  'Delete' |
  'Select'

export type ToolStateType = {
  fogOfWarCountryId: number;
  radius: number;
  tool: ToolType;
  toolUnit: string|null;
  toolItem: string|null;
  tileType: number;
  countryId: number;
}

export type StatType = 'attack' | 'maxHp' | 'vision' | 'range' | 'speed' | 'flying' | 'detector' | 'invisible'
export const AllStats:StatType[] = ['attack', 'maxHp', 'vision', 'range', 'speed', 'flying', 'detector', 'invisible']

export type TabType = 'Field' | 'Units' | 'Items' | 'Skills' | 'Buffs' | 'Upgrades' | 'Scripts' | 'Map' | 'Texts' | 'Particles'
export const AllTabs:TabType[] = ['Field', 'Map', 'Units', 'Items', 'Skills', 'Buffs', 'Upgrades', 'Scripts', 'Texts', 'Particles']

export type AffectType = 'All' | 'Allies' | 'Enemies'
export const AllAffects:AffectType[] = ['All', 'Allies', 'Enemies']

export type EditorStateType = {
  activeTab: TabType;
  mode: 'play' | 'edit' | 'test';
  jsonEditorTrigger: boolean;
}

export type ToolStateChangeType = Partial<ToolStateType>;

export type ObjectDataType = {
  id: string;
  buffs: BuffType[];
  type: string;
  pos: HexCoords;
}

export type ItemDataType = ObjectDataType & {
  invisible: number;
  unpickable: boolean;
}

export type UnitDataType = ObjectDataType & {
  dir: number;
  countryId: number;
  orders: OrderType[];
  hp: number;
  stats: UnitStatsType;
}

export type SkillType = {
  id: string;
  args: string[];
  mana: number;
  script: string;
  price: number;
  radius: number;
  range: number;
}

export type HexCoords = {
  q: number;
  r: number;
}

export type ObjectType = {
  type: string;
  buffs: string[];
}

export type UnitStatsType = ObjectType & {
  attack: number;
  range: number;
  speed: number;
  vision: number;
  detector: number;
  invisible: number;
  maxHp: number;
  flying: number;
  skills: string[];
}

export type ItemType = ObjectType & {
  unpickable: boolean;
  invisible: number;
}

export type OrderType = {
	type: string;
	args: string[];
	price: number;
	mana: number;
	range: number;
  radius: number;
}

export type ColorAdjust = {
  saturation?: number;
	lightness?: number;
	hue?: number;
	contrast?: number;
	gain: { 
    color : number; 
    alpha : number; 
  };
}

export const EffectTemplates = {
  OnDeath: { script:'', args: [] },
  OnAttack: { script:'', args: [] },
  OnDefend: { script: '', args: [] },
  OnTurnStart: { script: '', args: [] },//works for items too
  OnTurnEnd: { script: '', args: [] },//works for items too
  OnBuffEnd: { script: '', args: [] },//works for items too
  OnTouch: { script: '', args: [] },//works only for items

  SetStat: { stat:'', value:0 },
  ChangeStat: { stat:'', delta:0 },
  
  AddSkill: { id:'' },
  //AddCustomSkill: { skill:SkillType },//TODO: implement this
  RemoveSkill: { id:'' },
  BlockSkills: null,
  
  Aura: { //works for items too
    radius: 0,
    effects: [],
    affects: '',
    particles: '',
    color: {
      gain: { color: 0,  alpha: 1 }
    },
  }
} as const

export const EffectTypes = [...Object.keys(EffectTemplates)] as const

export type Effects = keyof typeof EffectTemplates

export type EffectType = 'BlockSkills' | {
  [type in Effects]: {
    value?: number;
    script?: string;
    args?: string[];
    stat?: StatType;
    delta?: number;
    id?: string;//skillId
    //skill: SkillType;//custom skill

    //Aura params:
    radius?: number;
    effects?: EffectType[];//
    affects?: AffectType, 
    particles?: string;
    color?: ColorAdjust;//
  } 
}

export type BuffType = {
  type: string;
  effects: EffectType[];
  turns: number;
}

export type UpgradeType = {
  type: string;
  effects: EffectType[];
  unitTypes: string[];
}

export type CountryInfo = {
  color: number;
  minerals: number;
  mana: number;
}

export type TileTypeInfo = {
  image_h: string;
  image_v: string;
  color: number;
}

export type MapInfo = {
  mapId: string;
  name: string;
  version: number;
  author: string | null;
  startField: string;
  singlePlayer: boolean;
  maxPlayers: number;
  countries: CountryInfo[];
  tiles: TileTypeInfo[];
}

export type UnitsMap = {
  [index: string]: UnitStatsType;
}

export type ItemsMap = {
  [index: string]: ItemType;
}

export type BuffsMap = {
  [index: string]: BuffType;
}

export type UpgradesMap = {
  [index: string]: UpgradeType;
}

export type SkillsMap = {
  [index: string]: SkillType;
}
