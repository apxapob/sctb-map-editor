import { action } from 'mobx'
import { MapFiles } from '../MapFiles'
import { EditorState, JsonMode } from '../ToolState'
import { TabType } from '../../types/types'

const ToggleJsonMode = (tab?:TabType) => {
  if (!tab) tab = EditorState.activeTab
  if (
    MapFiles.status !== 'Loaded' ||
    tab === 'Scripts' ||
    tab === 'Particles'
  ) return
  JsonMode[tab] = !JsonMode[tab]
}

export default action(ToggleJsonMode)
