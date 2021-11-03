## SortableList 排序列表

### 基本用法:

```tsx
import React, { useState } from 'react'
import { Button, Space } from 'antd'
import { SortableList } from '@toy-box/toybox-ui'

const opts = [
  {
    label: '选项A',
    value: 'a',
  },
  {
    label: '选项B',
    value: 'b',
    disabled: true,
  },
  {
    label: '选项C',
    value: 'c',
  },
  {
    label: '选项D',
    value: 'd',
  },
  {
    label: '选项E',
    value: 'e',
  },
  {
    label: '选项F',
    value: 'f',
    disabled: true,
  },
  {
    label: '选项G',
    value: 'g',
  },
  {
    label: '选项H',
    value: 'h',
  },
]

export default () => {
  const [dataSource, setDataSource] = useState(opts)
  const itemRender = ({ item, dragHandleProps }) => {
    return (
      <div style={{ display: 'flex' }}>
        <div {...dragHandleProps}>=</div>
        {item.label}
      </div>
    )
  }

  return (
    <div>
      <SortableList
        dataSource={dataSource}
        onChange={setDataSource}
        itemRender={itemRender}
        idKey="value"
      ></SortableList>
    </div>
  )
}
```
