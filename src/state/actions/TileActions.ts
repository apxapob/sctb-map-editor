import { action } from "mobx"
import { MapFiles, INFO_PATH } from "../MapFiles"
import { TabsState } from "../ToolState"
import { JSONArray, JSONObject } from "../../types/types"

export const RemoveTileType = action((idx:number) => {
  (MapFiles.json[INFO_PATH].tiles as JSONArray).splice(idx, 1)
  TabsState["Map"] = JSON.stringify(MapFiles.json[INFO_PATH], null, 2)
})

export const AddMapInfoTile = action(() => {
  const tiles = MapFiles.json[INFO_PATH].tiles as JSONObject[]
  tiles.push({ ...tiles[0] })
  TabsState["Map"] = JSON.stringify(MapFiles.json[INFO_PATH], null, 2)
})
