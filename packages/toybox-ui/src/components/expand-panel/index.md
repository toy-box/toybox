## Expand Panel 可展开操作栏

#### 基本用法

```tsx
import React from 'react'
import { ExpandPanel } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

export default () => {
  return (
    <div>
      <ExpandPanel title="展开操作栏">
        <ul>
          <li>123</li>
          <li>234</li>
          <li>345</li>
        </ul>
      </ExpandPanel>
    </div>
  )
}
```
