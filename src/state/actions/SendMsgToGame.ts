import { GameCanvasId } from '../../components/game/GameCanvas'
import { GameMessage } from '../../types/types'

const SendMsgToGame = (msg:GameMessage):void => {
  const gameIframe = document.getElementById(GameCanvasId) as HTMLIFrameElement
  gameIframe?.contentWindow?.postMessage(JSON.stringify(msg), '*')
}

export default SendMsgToGame
