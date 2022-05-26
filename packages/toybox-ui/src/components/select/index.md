## SelectPro 选择器 Pro

### 基本用法

```tsx
import React from 'react'
import { Select } from '@toy-box/toybox-ui'

const options = [
  {
    label: 'One',
    value: '111',
  },
  {
    label: 'Tow',
    value: '222',
  },
  {
    label: 'Three',
    value: '333',
  },
  {
    label: 'Four',
    value: '444',
  },
  {
    label: 'Five',
    value: '555',
  },
  {
    label: 'Six',
    value: '666',
  },
]

export default () => {
  return <Select options={options} style={{ width: '200px' }} />
}
```

### 多选

```tsx
import React from 'react'
import { Select } from '@toy-box/toybox-ui'
// import request from 'umi-request'

// 远程多选
// function metaRemote() {
//   return async () => {
//     const data = await request(
//       'https://run.mocky.io/v3/48a53541-6f8f-4e1d-83a9-40189d7e197f',
//       {
//         method: 'GET',
//       }
//     )
//     return data.address
//   }
// }

const options = [
  {
    label: 'One',
    value: '111',
  },
  {
    label: 'Tow',
    value: '222',
  },
  {
    label: 'Three',
    value: '333',
  },
  {
    label: 'Four',
    value: '444',
  },
  {
    label: 'Five',
    value: '555',
  },
  {
    label: 'Six',
    value: '666',
  },
]
export default () => {
  return (
    <Select
      mode={'multiple'}
      // remote={metaRemote()}
      options={options}
      style={{ width: '200px' }}
      showSearch
    />
  )
}
```

### 远程

```tsx
import React from 'react'
import { Select } from '@toy-box/toybox-ui'

const options = [
  {
    label: '111',
    value: '111',
  },
  {
    label: '222',
    value: '222',
  },
  {
    label: '333',
    value: '333',
  },
  {
    label: '444',
    value: '444',
  },
  {
    label: '555',
    value: '555',
  },
  {
    label: '666',
    value: '666',
  },
]
const search = async (name) => {
  console.log('search', name)
  return await options
}

export default () => {
  return (
    <Select showSearch allowClear remote={search} style={{ width: '200px' }} />
  )
}
```

### 只读模式

```tsx
import React from 'react'
import { Tag } from 'antd'
import { Select } from '@toy-box/toybox-ui'

const options = [
  {
    label: 'ONE',
    value: '111',
  },
  {
    label: 'TWO',
    value: '222',
  },
  {
    label: 'THREE',
    value: '333',
  },
  {
    label: 'FOUR',
    value: '444',
  },
  {
    label: 'FIVE',
    value: '555',
  },
  {
    label: 'SIX',
    value: '666',
  },
]
export default () => {
  const itemRender = (value: string, title: string) => <Tag>{title}</Tag>
  return (
    <>
      <Select
        value={['111', '222']}
        mode={'multiple'}
        options={options}
        style={{ width: '200px' }}
        optionSearch
        readMode
      />
      <p />
      <Select
        value={['111', '222']}
        mode={'multiple'}
        options={options}
        style={{ width: '200px' }}
        optionSearch
        itemRender={itemRender}
        readMode
      />
    </>
  )
}
```

### 特色搜索

```tsx
import React from 'react'
import { Select } from '@toy-box/toybox-ui'

const options = [
  {
    label: '111',
    value: '111',
  },
  {
    label: '222',
    value: '222',
  },
  {
    label: '333',
    value: '333',
  },
  {
    label: '444',
    value: '444',
  },
  {
    label: '555',
    value: '555',
  },
  {
    label: '666',
    value: '666',
  },
]
export default () => {
  return <Select options={options} style={{ width: '200px' }} optionSearch />
}
```
