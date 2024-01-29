import { action, toJS } from "mobx";
import { MapFiles } from "../state/MapFiles";
import { SpriteSheetInfo } from "../types/types";
import { UpdateUnsavedData } from "../state/actions/UpdateText";
import { SaveFile } from "../state/actions/SaveChanges";

export const SortSprites = action((spritesInfoPath:string) => {
  const info = MapFiles.json[spritesInfoPath ?? ''] as SpriteSheetInfo
  info.sprites.sort((s1, s2) => s1.name.localeCompare(s2.name))
  UpdateUnsavedData(spritesInfoPath, JSON.stringify(info, null, 2) )
  SaveFile(spritesInfoPath)
})