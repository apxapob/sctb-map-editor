import { action } from 'mobx'
import { PressedKeys } from '../PressedKeys'

const RotateMap = (clockwise:boolean):void => {
  PressedKeys[clockwise ? 'KeyE' : 'KeyQ'] = 'pressed'
  setTimeout(() => {
    delete PressedKeys[clockwise ? 'KeyE' : 'KeyQ']
  }, 100)
}

export default action(RotateMap)
