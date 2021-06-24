## TreeSelect 筛选条件标签

<!-- #### 基本用法

```tsx
import React, { useCallback, useState } from 'react'
import { FieldTreeSelect } from '@toy-box/meta-components'
import 'antd/dist/antd.css'

const genTreeNode = (parentId, isLeaf = false) => {
  const random = Math.random().toString(36).substring(2, 6)
  return {
    id: random,
    pId: parentId,
    value: random,
    title: isLeaf ? 'Tree Node' : 'Expand to load',
    isLeaf,
  }
}

export default () => {
  const [treeData, setTreeDate] = useState(
    [
      { id: 1, pId: 0, value: '1', title: 'Expand to load' },
      { id: 2, pId: 0, value: '2', title: 'Expand to load' },
      { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
    ]
  )
  const [value, setValue] = useState()

  const onLoadData = useCallback((id) =>
    new Promise(resolve => {
      setTimeout(() => {
        if (id) {
          resolve([
            genTreeNode(id, false),
            genTreeNode(id, true),
          ])
        } else {
          resolve([
            genTreeNode(0, false),
          ])
        }
      }, 300)
    }), [treeData, setTreeDate])

  return <FieldTreeSelect
    value={value}
    style={{ width: '120px' }}
    onChange={setValue}
    loadData={onLoadData}
  />
}
``` -->

#### 初始化

```tsx
import React, { useCallback, useState } from 'react'
import { FieldTreeSelect } from '@toy-box/meta-components'
import 'antd/dist/antd.css'

const genTreeNode = (parentId, isLeaf = false) => {
  const random = Math.random().toString(36).substring(2, 6)
  return {
    id: random,
    pId: parentId,
    value: random,
    label: isLeaf ? 'Tree Node' : 'Expand to load',
    isLeaf,
  }
}

const searchTreeNodes = (ids: string[]) => {
  return ids.map((id) => ({
    id,
    pId: 0,
    value: id,
    label: `NODE - ${id}`,
  }))
}

export default () => {
  const [treeData, setTreeDate] = useState([
    { id: 1, pId: 0, value: '1', label: 'Expand to load' },
    { id: 2, pId: 0, value: '2', label: 'Expand to load' },
    { id: 3, pId: 0, value: '3', label: 'Tree Node', isLeaf: true },
  ])
  const [value, setValue] = useState('23')

  const onLoadData = useCallback(
    (id) =>
      new Promise((resolve) => {
        setTimeout(() => {
          if (id) {
            resolve([genTreeNode(id, false), genTreeNode(id, true)])
          } else {
            resolve([genTreeNode(0, false)])
          }
        }, 300)
      }),
    [treeData, setTreeDate]
  )

  const loadByValue = useCallback(
    (ids: string[]) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve([searchTreeNodes(ids)])
        }, 300)
      }),
    []
  )

  return (
    <FieldTreeSelect
      value={value}
      style={{ width: '120px' }}
      onChange={setValue}
      loadData={onLoadData}
      loadByValue={loadByValue}
    />
  )
}
```
