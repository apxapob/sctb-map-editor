import { observable } from 'mobx'

//we need to send pressed keys to the game when iframe loses focus
export const PressedKeys: { [key: string]: string } = observable({})
