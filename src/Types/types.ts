export type GameMessage = {
  method: string;
  data?: number | string | boolean | string[] |
    {[index: string]: number | string | boolean};
};
