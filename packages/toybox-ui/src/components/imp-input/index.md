## ImpInput

### 基础用法

```tsx
import React, { useState } from 'react'
import { ImpInput } from '@toy-box/toybox-ui'
import { HomeFill } from '@airclass/icons'
import 'antd/dist/antd.css'

export default () => {
  const [data, setData] = useState('Good')
  return (
    <React.Fragment>
      <ImpInput
        value={data}
        onSave={setData}
        icon={<HomeFill />}
        size={'18px'}
      />
    </React.Fragment>
  )
}
```
