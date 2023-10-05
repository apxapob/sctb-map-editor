import { observer } from "mobx-react-lite"
import { INFO_PATH, MapFiles } from "../../../state/MapFiles"
import { MapInfo } from "../../../types/types"

const CountryColorSelector = (props:{
  countryId: number | undefined,
  onChange: (color:number) => void
}) => {
  const mapInfo = MapFiles.json[INFO_PATH] as MapInfo
  const countryColors = [0xffffff, ...mapInfo.countries.map(c => c.color)]

  return <select value={props.countryId}
    style={{ 
      width: 60,
      backgroundColor: props.countryId === undefined ? 'unset' : '#'+countryColors[props.countryId].toString(16)
    }}
    onChange={e => props.onChange( parseInt(e.target.value) )}
  >
    {props.countryId === undefined &&
      <option value={undefined} style={{ backgroundColor: 'black' }} />
    }
    {countryColors.map(
      (countryColor:number, idx:number) => 
        <option key={idx} value={idx} style={{ backgroundColor: '#'+countryColor.toString(16) }} />
    )}
  </select>
}

export default observer(CountryColorSelector)