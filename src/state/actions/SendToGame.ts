import { toJS } from 'mobx'
import { GameCanvasId } from '../../components/Views/GameCanvas'
import { GameMessage } from '../../types/types'

const SendToGame = (msg:GameMessage):void => {
  if ('data' in msg) {
    msg.data = toJS(msg.data)
  }
  
  const gameIframe = document.getElementById(GameCanvasId) as HTMLIFrameElement
  gameIframe?.contentWindow?.postMessage(msg, '*')
}

export default SendToGame
