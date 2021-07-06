## ButtonCluster 按钮集群

#### 普通使用

```tsx
import React from 'react'
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
import { HomeLine, Home2Line, Home3Line } from '@airclass/icons'
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
    icon: <HomeLine />,
  },
  {
    text: 'Button 4',
    icon: <Home2Line />,
  },
  {
    text: 'Button 5',
    icon: <Home3Line />,
  },
]
export default () => <ButtonCluster items={buttons} />
```

#### Group 模式

```tsx
import React from 'react'
import { ArrowLeftSLine } from '@airclass/icons'
import { ButtonCluster } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

const buttons = [
  {
    text: 'Button 1',
    type: 'primary',
  },
  {
    text: 'Button 2',
  },
  {
    text: 'Button 3',
  },
  {
    text: 'Button 4',
  },
  {
    text: 'Button 5',
    danger: true,
  },
]
export default () => <ButtonCluster items={buttons} max={3} group />
```
