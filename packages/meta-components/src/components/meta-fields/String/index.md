## FieldString 字符串输入 Field

### 基本用法

```tsx
import React, { useState } from 'react'
import { FieldString } from '@toy-box/meta-components'
import 'antd/dist/antd.css'

const field = {
  key: 'string',
  type: 'string',
  name: '字符串',
}

export default () => {
  const [value, setValue] = useState()
  const [isCleared, setIsCleared] = useState()

  return (
    <>
      <div>{value}</div>
      <div>{isCleared}</div>
      <FieldString
        field={field}
        value={value}
        onChange={setValue}
        onClear={() => setIsCleared('cleared')}
        allowClear
      />
    </>
  )
}
```
