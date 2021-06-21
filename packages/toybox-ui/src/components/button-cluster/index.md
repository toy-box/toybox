## ButtonCluster 按钮组

#### 普通使用

```tsx
import React from 'react'
import { ArrowLeftSLine } from '@airclass/icons'
import { ButtonCluster } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

const buttons = [
  {
    text: 'Button 1',
  },
  {
    text: 'Button 2',
  },
  {
    text: 'Button 3',
  },
]
export default () => <ButtonCluster items={buttons} />
```

#### 超出限制数量

```tsx
import React from 'react'
import { ArrowLeftSLine } from '@airclass/icons'
import { ButtonCluster } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

const buttons = [
  {
    text: 'Button 1',
  },
  {
    text: 'Button 2',
  },
  {
    icon: <ArrowLeftSLine />,
  },
  {
    text: 'Button 4',
  },
  {
    text: 'Button 5',
  },
]
export default () => <ButtonCluster items={buttons} />
```
