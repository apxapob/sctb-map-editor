import { observable } from 'mobx'

export const MapFiles:{
  binary: {
    [filename: string]: number;
  };
  text: {
    [filename: string]: string;
  };
  lastLoadedFile: string;
  progress: number;
} = observable({
  binary: {},
  text: {},
  lastLoadedFile: '',
  progress: 0
})
