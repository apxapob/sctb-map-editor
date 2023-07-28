export type CommandType = {
  command: 'SAVE_CHANGES' | 'EDIT_MAP' | 'LOADING_START' | 'CREATE_MAP' | 
           'TEST_MAP' | 'JSON_MODE' | 'LOAD_MAPS_LIST' | 'EXIT' | 'LOAD_SAVES_LIST';
} | LoadTextCommandType | LoadBinaryCommandType | LoadMapErrorType | MapsListType
  | SaveTextFileType | FSCommandType | RenameType | LoadingEndType | OpenMapType | SavesListType

export type SaveTextFileType = {
  command: 'SAVE_TEXT_FILE' | 'SAVE_GAME';
  data: { path: string; text: string };
}

export type OpenMapType = {
  command: 'OPEN_MAP' | 'DELETE_SAVE_FILE' | 'LOAD_GAME' | 'SAFE_FILE_LOADED';
  data: string;
}

export type SavesListType = {
  command: 'SAVES_LIST';
  saves: string;
}

export type MapsListType = {
  command: 'MAPS_LIST';
  maps: string[];
}

export type LoadingEndType = {
  command: 'LOADING_END';
  forEditing: boolean
}

export type FSCommandType = {
  command: 'MAKE_DIR' | 'LOAD_DIRECTORY' | 'DELETE' | 'DELETED';
  path: string;
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
} 

export type LoadBinaryCommandType = {
  command: 'LOAD_BINARY_FILE';
  file: string;
  progress: number;
  bytes: Uint8Array;
}

export type LoadMapErrorType = {
  command: 'LOAD_MAP_ERROR', 
  error: string
}
