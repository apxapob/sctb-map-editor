import { observer } from "mobx-react-lite"
import { INFO_PATH, MapFiles } from "../../../state/MapFiles"
import { MapInfo } from "../../../types/types"
import { ToolState } from "../../../state/ToolState"
import ChangeTool from "../../../state/actions/ChangeTool"
import { IntToRGB } from "../../../utils/utilFuncs"

const TileTypeSelector = () => {
  const tileType = ToolState.tileType;
  const mapInfo = MapFiles.json[INFO_PATH] as MapInfo
  const tileColors = mapInfo.tiles.map(t => t.color)
  return <select value={tileType}
    style={{ 
      width: 60,
      backgroundColor: tileType === undefined ? 'unset' : IntToRGB(tileColors[tileType])
    }}
    onChange={e => ChangeTool({ tileType: parseInt(e.target.value) })}
  >
    {tileColors.map(
      (tileColor:number, idx:number) => <option key={idx} value={idx} style={{ backgroundColor: IntToRGB(tileColor) }} />
    )}
  </select>
}

export default observer(TileTypeSelector)