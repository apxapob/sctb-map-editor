export type CommandType = {
  command: 'SAVE_CHANGES' | 'EDIT_MAP' | 'LOADING_START' | 'CREATE_MAP' | 'TEST_MAP' | 'JSON_MODE' | 'LOAD_MAPS_LIST' | 'EXIT';
} | LoadTextCommandType | LoadBinaryCommandType | LoadMapErrorType | MapsListType
  | SaveTextFileType | FSCommandType | RenameType | LoadingEndType | OpenMapType

export type SaveTextFileType = {
  command: 'SAVE_TEXT_FILE';
  data: { path: string; text: string };
}

export type OpenMapType = {
  command: 'OPEN_MAP';
  data: string;
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
