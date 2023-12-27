export type CommandType = {
  command: 'SAVE_CHANGES' | 'EDIT_MAP' | 'LOADING_START' | 'CREATE_MAP' | 
           'TEST_MAP' | 'JSON_MODE' | 'LOAD_MAPS_LIST' | 'EXIT';
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

export type LoadingEndType = {
  command: 'LOADING_END';
  mapId: string;
  editMode: boolean;//shows if map loaded in map editor or in game
}

export type FSCommandType = {
  command: 'MAKE_DIR' | 'LOAD_DIRECTORY' | 'DELETE' | 'DELETED' | 'ADD_FILE';
  path: string;
  dirFiles?: string[];
  editMode: boolean;//shows if map loaded in map editor or in game
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
  editMode: boolean;//shows if map loaded in map editor or in game
} 

export type LoadBinaryCommandType = {
  command: 'LOAD_BINARY_FILE';
  file: string;
  progress: number;
  bytes: Uint8Array;
  editMode: boolean;//shows if map loaded in map editor or in game
}

export type LoadMapErrorType = {
  command: 'LOAD_MAP_ERROR', 
  error: string
}
