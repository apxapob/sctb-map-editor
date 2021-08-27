import { observable } from 'mobx'

const MapState = {
  size: 19
}

export default observable(MapState)

//we need to send pressed keys to the game when iframe loses focus
export const PressedKeys: { [key: string]: string } = observable({})
