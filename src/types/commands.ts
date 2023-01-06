export type CommandType = {
  command: 'NEW_MAP' | 'SAVE_CHANGES' | 'OPEN_MAP' | 'LOADING_START' | 'LOADING_END';
} | LoadTextCommandType | LoadBinaryCommandType | LoadMapErrorType | SaveTextFileType | CreateMapType | MakeDirType

export type CreateMapType = {
  command: 'CREATE_MAP';
  mapId: string;
  mapName: string;
  playersCount: number;
  mapSize: number;
}

export type SaveTextFileType = {
  command: 'SAVE_TEXT_FILE';
  data: { path: string; text: string };
}

export type MakeDirType = {
  command: 'MAKE_DIR';
  path: string;
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
