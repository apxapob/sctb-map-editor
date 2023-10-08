import { observer } from "mobx-react-lite"
import { INFO_PATH, MapFiles } from "../../../state/MapFiles"
import { MapInfo } from "../../../types/types"
import { IntToRGB } from "../../../utils/utilFuncs"

const CountryColorSelector = (props:{
  onChange: (color:number) => void;
  countryId: number | undefined
}) => {
  const countryId = props.countryId
  const mapInfo = MapFiles.json[INFO_PATH] as MapInfo
  const countryColors = [0x000000, ...mapInfo.countries.map(c => c.color)]

  return <select value={countryId}
    style={{
      width: 60,
      backgroundColor: countryId === undefined ? 'unset' : IntToRGB(countryColors[countryId])
    }}
    onChange={e => props.onChange( parseInt(e.target.value) )}
  >
    {countryColors.map(
      (countryColor:number, idx:number) => <option key={idx} value={idx} style={{ backgroundColor: IntToRGB(countryColor) }} >
        {idx === 0 && 'No country'} 
      </option>
    )}
  </select>
}

export default observer(CountryColorSelector)