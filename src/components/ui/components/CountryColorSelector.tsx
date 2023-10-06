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
  const countryColors = [0xffffff, ...mapInfo.countries.map(c => c.color)]

  return <select value={countryId}
    style={{ 
      width: 60,
      backgroundColor: countryId === undefined ? 'unset' : IntToRGB(countryColors[countryId])
    }}
    onChange={e => props.onChange( parseInt(e.target.value) )}
  >
    {countryId === undefined &&
      <option value={undefined} style={{ backgroundColor: 'black' }} />
    }
    {countryColors.map(
      (countryColor:number, idx:number) => <option key={idx} value={idx} style={{ backgroundColor: IntToRGB(countryColor) }} />
    )}
  </select>
}

export default observer(CountryColorSelector)