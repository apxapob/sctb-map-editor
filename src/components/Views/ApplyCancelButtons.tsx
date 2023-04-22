import { observer } from 'mobx-react-lite'
import React from 'react'
import { CancelUnsavedData } from '../../state/actions/UpdateText'
import SaveChanges from '../../state/actions/SaveChanges'
import { EditorState, TabsState } from '../../state/ToolState'

const ApplyCancelButtons = () => 
  <div className='hflex' style={{ gap: 8, minHeight: 24 }}>
    {TabsState[EditorState.activeTab] &&
      <>
        <button onClick={SaveChanges}>
          ✓ Apply changes
        </button> 
        <button onClick={CancelUnsavedData}>
          ✗ Cancel
        </button>
      </>
    }
  </div>

export default observer(ApplyCancelButtons)
