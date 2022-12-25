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
  status: 'Loaded' | 'Loading' | 'Error' | null;
  error: string | null;
} = observable({
  binary: {},
  text: {},
  lastLoadedFile: '',
  progress: 0,
  status: null,
  error: null
})
