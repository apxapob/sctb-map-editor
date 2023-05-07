export type JSONValue = string | number | boolean | JSONObject | JSONArray
export type JSONObject = { [x: string]: JSONValue; }
export type JSONArray = JSONValue[]

export type GameMessage = {
  method: 'init_complete' | 'mark_field_unsaved' | 'test_map' | 'reset_units_buffs';
} | {
  method: 'save_map';
  data: string;
} | {
  method: 'show_map_editor';
  data: string;
} | {
  method: 'tool_updated';
  data: {[index: string]: number | string | boolean};
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
    path: string,
    text: string,
    refresh: boolean
  }
} | {
  method: 'load_binary_file';
  data: {
    path: string,
    bytes: Uint8Array;
  }
} | {
  method: 'text_file_updated', 
  data: { path: string; text: string }
} | {
  method: 'selected_objects' | 'update_objects', 
  data: (ItemDataType | UnitDataType)[];
};

export type PanelType = 
  'MapSettings' | 
  'LoadingMap'

export type ToolType = 
  'LandUp' | 
  'LandDown' | 
  'DeleteTiles' |
  'CreateTiles' |
  'CreateManaTiles' |
  'CreateItems' |
  'CreateUnits' |
  'Delete' |
  'Select'

export type ToolStateType = {
  radius: number;
  tool: ToolType;
  toolUnit: string|null;
  toolItem: string|null;
}

export type StatType = 'attack' | 'maxHp' | 'vision' | 'range' | 'speed' | 'flying' | 'detector' | 'invisible'

export type TabType = 'Field' | 'Units' | 'Items' | 'Skills' | 'Buffs' | 'Upgrades' | 'Scripts' | 'Map' | 'Texts' | 'Particles'

export type EditorStateType = {
  activePanel: PanelType | null;
  activeTab: TabType;
  mapTesting: boolean;
}

export type ToolStateChangeType = {
  radius?: number;
  tool?: ToolType;
  toolUnit?: string;
  toolItem?: string;
}

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
	gain?: { 
    color : number; 
    alpha : number; 
  };
}

export type Affects = 'All' | 'Allies' | 'Enemies'

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
    color: {}
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
    affects?: Affects, 
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

export type MapInfo = {
  mapId: string;
  name: string;
  version: number;
  author: string | null;
  startField: string;
  singlePlayer: boolean;
  maxPlayers: number;
  countryColors: string[];
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

export type SkillsMap = {
  [index: string]: SkillType;
}
