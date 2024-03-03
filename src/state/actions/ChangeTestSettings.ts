import { action } from 'mobx'
import { TestingSettings } from '../ToolState'
import { MapInfo, PlayerSetting } from '../../types/types'
import { MapFiles, INFO_PATH } from '../MapFiles'

export const ChangePlayerSetting = action(
  (idx:number, setting:PlayerSetting):void => {
    TestingSettings.players[idx] = setting
  }
)

export const ResetPlayerSetting = action((minPlayers:number) => {
  TestingSettings.players = Array(minPlayers).fill(0).map(
    () => 'player'
  )
})