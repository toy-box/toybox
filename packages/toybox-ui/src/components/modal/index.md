## Modal 对话框框

Function Dialog:

```tsx
import React from 'react'
import { Button, Modal } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

const { dialog } = Modal

export default () => {
  const dialogContent = ({ close }) => {
    return (
      <div>
        <h3>this is dialog content</h3>
        <Button onClick={close}>close</Button>
      </div>
    )
  }
  const handleDialog = () => {
    dialog({
      title: 'Open dialog',
      closable: true,
      content: dialogContent,
    })
  }
  return (
    <div>
      <Button onClick={handleDialog}>Dialog</Button>
    </div>
  )
}
```
