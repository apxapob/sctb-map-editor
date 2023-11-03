export type CommandType = {
  command: 'SAVE_CHANGES' | 'EDIT_MAP' | 'LOADING_START' | 'CREATE_MAP' | 
           'TEST_MAP' | 'JSON_MODE' | 'LOAD_MAPS_LIST' | 'EXIT';
} | LoadTextCommandType | LoadBinaryCommandType | LoadMapErrorType | ToGameType
  | SaveTextFileType | FSCommandType | RenameType | LoadingEndType | OpenMapType

export type SaveTextFileType = {
  command: 'SAVE_TEXT_FILE' | 'SAVE_GAME';
  data: { path: string; text: string };
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
  editMode?: boolean;
}

export type FSCommandType = {
  command: 'MAKE_DIR' | 'LOAD_DIRECTORY' | 'DELETE' | 'DELETED' | 'ADD_IMAGE';
  path: string;
  dirFiles?: string[];
  editMode?: boolean;
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
  editMode?: boolean;
} 

export type LoadBinaryCommandType = {
  command: 'LOAD_BINARY_FILE';
  file: string;
  progress: number;
  bytes: Uint8Array;
  editMode?: boolean;
}

export type LoadMapErrorType = {
  command: 'LOAD_MAP_ERROR', 
  error: string
}
