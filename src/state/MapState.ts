import { observable } from 'mobx'
import { ToolStateType } from '../types/types'

const MapState = {
  size: 19
}

export default observable(MapState)

export const ToolState:ToolStateType = observable({
  radius: 1,
  tool: 'LandUp',
  toolUnit: 'soldier'
})

//we need to send pressed keys to the game when iframe loses focus
export const PressedKeys: { [key: string]: string } = observable({})
