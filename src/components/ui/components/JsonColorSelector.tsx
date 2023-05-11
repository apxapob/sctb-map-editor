import React from 'react'
import { observer } from 'mobx-react-lite'
import { GetJsonFileValue, UpdateJsonFileValue } from '../../../state/actions/UpdateText'

const toRGB = (num:number) => {
  const s = '000000' + num.toString(16)
  return '#' + s.substring(s.length - 6)
}

const JsonColorSelector = (
  { filePath, valuePath } : { filePath: string, valuePath: string }
) => {
  const value = GetJsonFileValue(filePath, valuePath) as number ?? 0

  return <input
    type='color'
    onChange={e => UpdateJsonFileValue(
      filePath,
      valuePath,
      parseInt(e.target.value.replace('#', '0x'))
    )}
    value={toRGB(value)}
  />
}

export default observer(JsonColorSelector)
