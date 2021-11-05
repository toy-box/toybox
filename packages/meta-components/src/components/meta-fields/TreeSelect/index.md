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

const departments = [
  {
    id: 'dep1',
    name: 'DEP1',
    pId: '',
  },
  {
    id: 'dep2_1',
    name: 'DEP2-1',
    pId: 'dep1',
  },
  {
    id: 'dep2_2',
    name: 'DEP2-2',
    pId: 'dep1',
    isLeaf: true,
  },
  {
    id: 'dep2_1_1',
    name: 'DEP2-2-1',
    pId: 'dep2_1',
    isLeaf: true,
  },
]

const searchTreeNodes = (ids: string[]) => {
  return ids.map((id) => ({
    id,
    pId: 0,
    value: id,
    label: `NODE - ${id}`,
  }))
}

export default () => {
  const [value, setValue] = useState('dep2_1')

  const onLoadData = useCallback(
    (id) =>
      new Promise((resolve) => {
        setTimeout(() => {
          if (id) {
            resolve(
              departments
                .filter((dept) => dept.id === id)
                .map((dept) => ({
                  id: dept.id,
                  label: dept.name,
                  title: dept.name,
                  value: dept.id,
                  isLeaf: dept.isLeaf,
                }))
            )
          } else {
            resolve(
              departments
                .filter(
                  (dept) =>
                    dept.pId == null || dept.pId === '' || dept.pId === 0
                )
                .map((dept) => ({
                  label: dept.name,
                  title: dept.name,
                  value: dept.id,
                  pId: 0,
                  isLeaf: false,
                }))
            )
          }
        }, 300)
      }),
    []
  )

  const loadByValue = useCallback(
    (ids: string[]) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            departments
              .filter((dept) => ids.includes(dept.id))
              .map((dept) => ({
                id: dept.id,
                label: dept.name,
                title: dept.name,
                value: dept.id,
                isLeaf: dept.isLeaf,
              }))
          )
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
