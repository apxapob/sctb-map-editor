export type GameMessage = {
  method: string;
  data?: number | string | boolean | 
    {[index: string]: number | string | boolean};
};
