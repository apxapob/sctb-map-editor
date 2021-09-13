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

export type UnitStatsType = {
  attack: number;
  buffs: string[];
  detector: boolean;
  flying: boolean;
  hp: number;
  orders: string[];
  range: number;
  speed: number;
  unit_type: string;
}

export type MapSettingsType = {
  units: UnitStatsType[];
}
