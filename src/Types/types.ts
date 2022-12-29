export type GameMessage = {
  method: 'init_complete';
} | {
  method: 'save_map';
  data: string;
} | {
  method: 'show_map_editor';
  data: string;
} | {
  method: 'on_get_save_info';
  data: { compressedGameState: string }
} | {
  method: 'tool_updated';
  data: {[index: string]: number | string | boolean};
} | {
  method: 'new_map';
  data: { 
    playersCount: number;
    mapSize: number;
  }; 
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
  'CreateUnits' |
  'DeleteUnits' |
  'SelectUnits'

export type ToolStateType = {
  radius: number;
  tool: ToolType;
  toolUnit: string;
}

export type TabType = 'Field' | 'Units' | 'Buffs' | 'Upgrades' | 'Scripts' | 'Map'

export type EditorStateType = {
  activePanel: PanelType | null;
  activeTab: TabType;
}

export type ToolStateChangeType = {
  radius?: number;
  tool?: ToolType;
  toolUnit?: string;
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

export type UpgradeType = {
  type: string;
  effects: EffectType[];
  unitTypes: string[];
}

export type MapInfo = {
  mapId: string;
  name: string;
  author: string | null;
  startField: string;
}
