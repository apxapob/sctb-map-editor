import { MapLoadMode } from "./commands";

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray
export type JSONObject = { [x: string]: JSONValue; }
export type JSONArray = JSONValue[]

export type SpriteSheetInfo = {
  packer:{
    width: number;
    height: number;
    animationFramesNum: number;
    directions: number;
    dir1_width?: number;
    dir1_dx?: number;
    dir1_dy?: number;
    dir2_width?: number;
    dir2_dx?: number;
    dir2_dy?: number;
    dir3_width?: number;
    dir3_dx?: number;
    dir3_dy?: number;
    dir4_width?: number;
    dir4_dx?: number;
    dir4_dy?: number;
    dir5_width?: number;
    dir5_dx?: number;
    dir5_dy?: number;
    dir6_width?: number;
    dir6_dx?: number;
    dir6_dy?: number;
    dir7_width?: number;
    dir7_dx?: number;
    dir7_dy?: number;
    dir8_width?: number;
    dir8_dx?: number;
    dir8_dy?: number;
    dir9_width?: number;
    dir9_dx?: number;
    dir9_dy?: number;
    dir10_width?: number;
    dir10_dx?: number;
    dir10_dy?: number;
    dir11_width?: number;
    dir11_dx?: number;
    dir11_dy?: number;
    dir12_width?: number;
    dir12_dx?: number;
    dir12_dy?: number;
    [propName: string]: number | string | undefined;
  },
  sprites: {
    name: string;
    x: number;
    y: number;
    w: number;
    h: number;
    trimLeft: number;
    trimTop: number;
    trimOWidth: number;
    trimOHeight: number;
  }[]
}

export type GameMessage = {
  method: 'report_error',
  error: string;
  details: string;
} | {
  method: 'init_complete' | 'mark_field_unsaved' | 'reset_objects' | 'to_main_screen' |
          'reset_field' | 'create_map' | 'maps_list' | 'loading_start' | 'save_changes';
} | {
  method: 'to_electron';
  data: any;
  requestId?: number;
} | {
  method: 'save_map' | 'saves_list' | 'save_file_loaded';
  data: string;
} | {
  method: 'show_map';
  data: {
    mapId: string;
    mode: MapLoadMode;
  };
  requestId?: number;
} | {
  method: 'test_map';
  data: {
    mode: string;
    players: string;
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
} | {
  method: 'rename_unit_type' | 'rename_item_type';
  data: {
    oldType: string; 
    newType: string;
  }
} | {
  method: 'delete_unit_type' | 'delete_item_type';
  data: {
    type: string;
  }
} | {
  method: 'update_field_size';
  data: {
    size: number;
  }
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

export type PlayerSetting = 'player' | 'ai' | null
export type TestingSettingsType = {
  players: PlayerSetting[];
}

export type StatType = 'attack' | 'maxHp' | 'vision' | 'range' | 'speed' | 'flying' | 'detector' | 'invisible'
export const AllStats:StatType[] = ['attack', 'maxHp', 'vision', 'range', 'speed', 'flying', 'detector', 'invisible']

export type TabType = 'Field' | 'Units' | 'Items' | 'Skills' | 'Buffs' | 'Upgrades' | 'Scripts' | 'Map' | 'Texts' | 'Particles' | 'Files'
export const AllTabs:TabType[] = [
  'Field', 'Map', 'Units', 'Items', 'Skills', 'Buffs', 'Upgrades', 'Scripts', 'Texts', 'Particles', 'Files'
]

export type AffectType = 'All' | 'Allies' | 'Enemies'
export const AllAffects:AffectType[] = ['All', 'Allies', 'Enemies']

export type EditorStateType = {
  activeTab: TabType;
  beforeTestTab: TabType;
  mode: MapLoadMode;
  editorTrigger: boolean;//needed to force editor to rerender
}

export type ToolStateChangeType = Partial<ToolStateType>;

export type ObjectDataType = {
  id: string;
  buffs: BuffType[];
  type: string;
  image: string;
  spriteSheetInfo?: string;
  pos: HexCoords;
  dir: number;
}

export type ItemDataType = ObjectDataType & {
  invisible: number;
  unpickable: boolean;
}

export type UnitDataType = ObjectDataType & {
  countryId: number;
  orders: OrderType[];
  hp: number;
  stats: UnitStatsType;
}

export type SkillType = {
  type: string;
  args: string[];
  script: string;
  areaScript: string;
  manaCost: number;
  mineralsCost: number;
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
  moveCostMinerals: number;
  moveCostMana: number;
  invisible: number;
  maxHp: number;
  hideHpBar: boolean;
  moveAreaScript: string;
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
	manaCost: number;
  mineralsCost: number;
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
  OnTouch: { script: '', args: [] },
  OnTouched: { script: '', args: [] },//works for items too

  SetStat: { stat:'', value:0 },
  ChangeStat: { stat:'', delta:0 },
  
  AddSkill: { id:'' },
  //AddCustomSkill: { skill:SkillType },//TODO: implement this
  RemoveSkill: { id:'' },
  BlockSkills: null,
  BlockAttacks: null,
  BlockMovement: null,
  
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

export type EffectType = 'BlockSkills' | 'BlockMovement' | 'BlockAttacks' | {
  [type in Effects]: {
    value?: number;
    script?: string;
    args?: string[];
    stat?: StatType;
    delta?: number;
    id?: string;//skillType
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
  control: 'only_player' | 'ai_or_player' | 'only_ai';
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
  minPlayers: number;
  maxPlayers: number;
  countries: CountryInfo[];
  tiles: TileTypeInfo[];
  teams?: 'disabled' | 'fixed' | 'configurable'
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
