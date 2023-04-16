import { action } from 'mobx'
import { MenuItem, MenuState } from '../MenuState'

const ShowMenu = (e:React.MouseEvent, items:MenuItem[]):void => {
  MenuState.menuX = e.clientX
  MenuState.menuY = e.clientY
  MenuState.items = items
}

export default action(ShowMenu)

export const HideMenu = action(() => { MenuState.items = [] })
