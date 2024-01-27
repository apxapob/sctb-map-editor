import { action } from 'mobx'
import { TestingSettings } from '../ToolState'
import { MapInfo } from '../../types/types'
import { MapFiles, INFO_PATH } from '../MapFiles'

export const ChangePlayersNum = action(
  (delta:number):void => {
    const { minPlayers, maxPlayers } = (MapFiles.json[INFO_PATH] as MapInfo)
    const players = Math.round(TestingSettings.players + delta)

    TestingSettings.players = Math.min(maxPlayers, Math.max(minPlayers, players))
  }
)