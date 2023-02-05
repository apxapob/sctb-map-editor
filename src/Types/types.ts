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
  method: 'selected_units' | 'update_units', 
  data: UnitDataType[];
};

export type PanelType = 
  'NewMap' | 
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

export type UnitDataType = {
  id: string;
  buffs: BuffDataType[];
  dir: number;
  countryId: number;
  type: string;
  stats: UnitStatsType;
  pos: HexCoords;
}

export type UnitStatsType = {
  attack: number;
  maxHp: number;
  vision: number;
  range: number;
  speed: number;
  flying: number;
	detector: number;
	invisible: number;
}

export type HexCoords = {
  q: number;
  r: number;
}

export type UnitType = {
  type: string;
  orders: OrderType[];
  buffs: string[];
  attack: number;
  hp: number;
  range: number;
  speed: number;
  vision: number;
  detector: number;
  invisible: number;
}

export type ItemType = {
  type: string;
  buffs: string[];
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

export type EffectType = {
  type: 'DoT' | 'Attack' | 'Vision' | 'Speed' | 'Range';
  value: number;
} | {
  type: 'Fly' | 'Detector' | 'Invisibility';
  value: boolean;
} | {
  type: 'OnDeath' | 'OnAttack' | 'OnDefend' | 'OnTurnStart';
  script: string;
  args: string[];
}

export type BuffType = {
  type: string;
  effects: EffectType[];
  turns: number;
}

export type BuffDataType = {
  buffType: string;
  turnsLeft: number;
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
  minPlayers: number;
  maxPlayers: number;
  countryColors: string[];
}
