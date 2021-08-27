export type GameMessage = {
  method: string;
  data?: number | string | boolean | string[] |
    {[index: string]: number | string | boolean};
};

export type ToolType = 
  'LandUp' | 
  'LandDown' | 
  'DeleteTiles' |
  'CreateTiles' |
  'CreateManaTiles' |
  'CreateUnits' |
  'DeleteUnits' |
  'SelectUnits'

export type ToolStateType ={
  radius: number;
  tool: ToolType;
  toolUnit: string;
}

export type ToolStateChangeType ={
  radius?: number;
  tool?: ToolType;
  toolUnit?: string;
}
