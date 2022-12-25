export type CommandType = {
  command: 'NEW_MAP' | 'SAVE_MAP' | 'OPEN_MAP' | 'LOADING_START' | 'LOADING_END';
} | LoadTextCommandType | LoadBinaryCommandType

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
