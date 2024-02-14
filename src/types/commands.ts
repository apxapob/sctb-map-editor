export type CommandType = {
  command: 'SAVE_CHANGES' | 'EDIT_MAP' | 'LOADING_START' | 'CREATE_MAP' | 
           'TEST_MAP' | 'LOAD_MAPS_LIST' | 'EXIT';
} | LoadTextCommandType | LoadBinaryCommandType | LoadMapErrorType | ToGameType
  | SaveTextFileType | FSCommandType | RenameType | LoadingEndType | OpenMapType | ShowMessageType

export type SaveTextFileType = {
  command: 'SAVE_TEXT_FILE' | 'SAVE_GAME';
  data: { path: string; text: string };
}

export type ShowMessageType = {
  command: 'SHOW_MESSAGE';
  title: string; 
  message: string;
}

export type ToGameType = {
  command: 'TO_GAME';
  data: any;
}

export type OpenMapType = {
  command: 'OPEN_MAP' | 'LOAD_GAME';
  data: string;
}

export type MapLoadMode = 'edit'|'play'|'replay'|'test'

export type LoadingEndType = {
  command: 'LOADING_END';
  mapId: string;
  mode: MapLoadMode;
}

export type FSCommandType = {
  command: 'MAKE_DIR' | 'LOAD_DIRECTORY' | 'DELETE' | 'DELETED' | 'ADD_FILE';
  path: string;
  dirFiles?: string[];
  gameFile?: boolean;//shows if the file belongs to game or map
  mode?: MapLoadMode;
}

export type RenameType = {
  command: 'RENAME' | 'RENAMED';
  path: string;
  newName: string;
}

export type LoadTextCommandType = {
  command: 'LOAD_TEXT_FILE';
  file: string;
  progress: number;
  text: string;
  gameFile: boolean;//shows if the file belongs to game or map
  mode: MapLoadMode;
} 

export type LoadBinaryCommandType = {
  command: 'LOAD_BINARY_FILE';
  file: string;
  progress: number;
  bytes: Uint8Array;
  gameFile: boolean;//shows if the file belongs to game or map
  mode: MapLoadMode;
}

export type LoadMapErrorType = {
  command: 'LOAD_MAP_ERROR', 
  error: string
}
