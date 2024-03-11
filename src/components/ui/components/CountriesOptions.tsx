import { MapFiles } from '../../../state/MapFiles'
import { GetJsonFileValue } from '../../../state/actions/UpdateText'
import { observer } from 'mobx-react-lite'
import './CountryOptions.css'
import { InputProps } from './JsonStringInput'
import { CountryInfo, MapInfo } from '../../../types/types'
import JsonNumberInput from './JsonNumberInput'
import JsonColorSelector from './JsonColorSelector'
import JsonValueSelector from './JsonValueSelector'
  
const CountriesOptions = (
  { filePath, valuePath }:InputProps
) => {
  const observedCountries = GetJsonFileValue(filePath, valuePath) as CountryInfo[]
  const maxPlayers = (MapFiles.json[filePath] as MapInfo).maxPlayers
  const teamsSetting = (MapFiles.json[filePath] as MapInfo).teams

  while (observedCountries.length !== maxPlayers) {
    if (observedCountries.length > maxPlayers) {
      observedCountries.pop()
    } else {
      observedCountries.push({
        color: 0xffffff,
        minerals: 0,
        mana: 0
      })
    }
  }

  return <div className='countries-grid'>
    <span>Country ID</span>
    <span>Color</span>
    <span title='Initial amount of minerals. You can change name of this resource in locale files. Use: label_minerals key to do it'>
      Minerals
    </span>
    <span title='Initial amount of mana. You can change name of this resource in locale files. Use: label_mana key to do it'>
      Mana
    </span>
    <span>Control</span>
    <span>{teamsSetting && teamsSetting !== "disabled" ? "Team ID" : ""}</span>
    
    {observedCountries.map((c, idx) => 
      [
        <span key={"1_" + idx}>
          {(idx + 1)}
        </span>,
        <JsonColorSelector
          key={"2_" + idx}
          filePath={filePath}
          valuePath={`countries.${idx}.color`}
        />,
        <JsonNumberInput
          key={"3_" + idx}
          placeholder='Minerals'
          title=""
          filePath={filePath}
          valuePath={`countries.${idx}.minerals`} 
          isInteger={true}
          min={0}
        />,
        <JsonNumberInput
          key={"4_" + idx}
          placeholder='Mana'
          title=""
          filePath={filePath}
          valuePath={`countries.${idx}.mana`} 
          isInteger={true}
          min={0}
        />,
        <JsonValueSelector 
          key={"5_" + idx}
          values={['only_player', "ai_or_player", "only_ai"]}
          defaultValue="only_player"
          filePath={filePath}
          valuePath={`countries.${idx}.control`}
        />,
        teamsSetting && teamsSetting !== "disabled" ?
        <JsonNumberInput
          key={"6_" + idx}
          placeholder='Team'
          title=""
          nullable={true}
          filePath={filePath}
          valuePath={`countries.${idx}.team`}
          isInteger={true}
          min={1}
        /> : <div key={"6_" + idx} />
      ]
    )}
  </div>
}

export default observer(CountriesOptions)
