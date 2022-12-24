export type GameMessage = {
  method: string;
  data?: number | string | boolean | string[] | Record<string, unknown>;
};

export type PanelType = 
  'NewMap' | 
  'MapCode'

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
  isUnitSelectionOpened: boolean;
  activePanel: PanelType | null;
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

export type MapSettingsType = {
  units: UnitType[];
  buffs: BuffType[];
  upgrades: UpgradeType[];
}
