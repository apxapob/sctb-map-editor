export type CommandType = {
  command: 'SAVE_CHANGES' | 'OPEN_MAP' | 'LOADING_START' | 'LOADING_END' | 'CREATE_MAP' | 'TEST_MAP';
} | LoadTextCommandType | LoadBinaryCommandType | LoadMapErrorType 
  | SaveTextFileType | FSCommandType | RenameType

export type SaveTextFileType = {
  command: 'SAVE_TEXT_FILE';
  data: { path: string; text: string };
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
