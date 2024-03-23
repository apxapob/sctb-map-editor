import { action } from 'mobx'
import { TestingSettings } from '../ToolState'
import { MapInfo, PlayerSetting } from '../../types/types'
import { INFO_PATH, MapFiles } from '../MapFiles'

export const ChangePlayerSetting = action(
  (idx:number, setting:PlayerSetting):void => {
    TestingSettings.players[idx] = setting
  }
)

export const ResetPlayerSetting = action(() => {
  const { minPlayers, maxPlayers, countries } = MapFiles.json[INFO_PATH] as MapInfo

  TestingSettings.players = Array(maxPlayers).fill(0).map(
    (_, idx) => {
      if(countries[idx].control === "only_ai") return "ai"
      return idx < minPlayers ? 'player' : null
    }
  )
})