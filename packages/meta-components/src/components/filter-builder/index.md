## FilterBuilder

### 基础用法

```tsx
import React, { useCallback, useState } from 'react'
import { FilterBuilder } from '@toy-box/meta-components'
import 'antd/dist/antd.css'

export default () => {
  const serviceTest = async function (resolve, key) {
    setTimeout(() => {
      resolve(key)
    }, 100)
  }

  function findOptions(key, name) {
    return new Promise((resolve) => {
      serviceTest(resolve, key)
    }).then((res) => {
      return [
        {
          label: 'SIX',
          value: '123',
        },
        {
          label: 'named',
          value: '456',
        },
      ]
    })
  }

  function findOfValues(key, value) {
    return new Promise((resolve) => {
      serviceTest(resolve, key)
    }).then((res) => {
      if (key === 'deptId')
        return [{ id: '2', pId: '1', value: '1', title: 'Expand to load2' }]
      return [
        {
          label: 'SIX',
          value: '123',
        },
        {
          label: 'named',
          value: '456',
        },
      ]
    })
  }

  const genTreeNode = useCallback((parentId, isLeaf = false) => {
    const random = Math.random().toString(36).substring(2, 6)
    return {
      id: random,
      pId: parentId,
      value: random,
      title: isLeaf ? 'Tree Node' : 'Expand to load',
      isLeaf,
    }
  }, [])

  function findDataTrees(key, parentId) {
    return new Promise((resolve) => {
      serviceTest(resolve, key)
    }).then((res) => {
      if (parentId === '2')
        return [{ id: '3', pId: '2', value: '3', title: 'Expand to load3' }]
      if (parentId)
        return [{ id: '2', pId: '1', value: '2', title: 'Expand to load2' }]
      return [{ id: '1', pId: 0, value: '1', title: 'Expand to load' }]
    })
  }

  const filter = {
    filterFieldMetas: [
      {
        description: null,
        exclusiveMaximum: null,
        exclusiveMinimum: null,
        format: null,
        key: 'deptId',
        maxLength: null,
        maximum: null,
        minLength: null,
        minimum: null,
        name: '部门',
        options: null,
        parentKey: 'parent_id',
        pattern: null,
        primary: null,
        properties: null,
        refObjectId: '5f9630d977b9ec42e4d0dca5',
        required: null,
        titleKey: 'name',
        type: 'objectId',
        unique: null,
        unBasic: true,
      },
      {
        description: null,
        exclusiveMaximum: null,
        exclusiveMinimum: null,
        format: null,
        key: 'date',
        maxLength: null,
        maximum: null,
        minLength: null,
        minimum: null,
        name: '日期',
        options: null,
        pattern: null,
        primary: null,
        properties: null,
        required: null,
        type: 'date',
      },
      {
        description: null,
        exclusiveMaximum: null,
        exclusiveMinimum: null,
        format: null,
        key: 'copId',
        maxLength: null,
        maximum: null,
        minLength: null,
        minimum: null,
        name: '公司',
        options: [
          {
            label: '12323232',
            value: '1',
          },
          {
            label: 'bbbbbbb',
            value: '2',
          },
        ],
        pattern: null,
        primary: null,
        properties: null,
        refObjectId: '5f9630d977b9ec42e4d0dca5',
        required: null,
        titleKey: 'name',
        type: 'singleOption',
        unique: null,
        unBasic: true,
      },
    ],

    filterFieldService: {
      findOptions: (key, name) => findOptions(key, name),
      findOfValues: (key, value) => findOfValues(key, value),
      findDataTrees: (key, parentId) => findDataTrees(key, parentId),
    },
  }

  const [value, setValue] = useState([
    {
      source: 'deptId',
      op: '$in',
      target: '1',
    },
  ])
  const handleFilter = useCallback(
    (logicFilter: IUncheckLogicFilter) => setValue(logicFilter),
    []
  )
  return (
    <div>
      <FilterBuilder
        filterFieldMetas={filter.filterFieldMetas}
        value={value}
        filterFieldService={filter.filterFieldService}
        onChange={(filterItem: Partial<ICompareOperation>[]) =>
          handleFilter(filterItem)
        }
      />
    </div>
  )
}
```

### 简单模式

```tsx
import React, { useCallback, useState } from 'react'
import { FilterBuilder } from '@toy-box/meta-components'
import 'antd/dist/antd.css'

export default () => {
  const serviceTest = async function (resolve, key) {
    setTimeout(() => {
      resolve(key)
    }, 100)
  }

  function findOptions(key, name) {
    return new Promise((resolve) => {
      serviceTest(resolve, key)
    }).then((res) => {
      return [
        {
          label: 'SIX',
          value: '123',
        },
        {
          label: 'named',
          value: '456',
        },
      ]
    })
  }

  function findOfValues(key, value) {
    return new Promise((resolve) => {
      serviceTest(resolve, key)
    }).then((res) => {
      if (key === 'deptId')
        return [{ id: '2', pId: '1', value: '1', title: 'Expand to load2' }]
      return [
        {
          label: 'SIX',
          value: '123',
        },
        {
          label: 'named',
          value: '456',
        },
      ]
    })
  }

  const genTreeNode = useCallback((parentId, isLeaf = false) => {
    const random = Math.random().toString(36).substring(2, 6)
    return {
      id: random,
      pId: parentId,
      value: random,
      title: isLeaf ? 'Tree Node' : 'Expand to load',
      isLeaf,
    }
  }, [])

  function findDataTrees(key, parentId) {
    return new Promise((resolve) => {
      serviceTest(resolve, key)
    }).then((res) => {
      if (parentId === '2')
        return [{ id: '3', pId: '2', value: '3', title: 'Expand to load3' }]
      if (parentId)
        return [{ id: '2', pId: '1', value: '2', title: 'Expand to load2' }]
      return [{ id: '1', pId: 0, value: '1', title: 'Expand to load' }]
    })
  }

  const filter = {
    filterFieldMetas: [
      {
        description: null,
        exclusiveMaximum: null,
        exclusiveMinimum: null,
        format: null,
        key: 'deptId',
        maxLength: null,
        maximum: null,
        minLength: null,
        minimum: null,
        name: '部门',
        options: null,
        parentKey: 'parent_id',
        pattern: null,
        primary: null,
        properties: null,
        refObjectId: '5f9630d977b9ec42e4d0dca5',
        required: null,
        titleKey: 'name',
        type: 'objectId',
        unique: null,
        unBasic: true,
      },
      {
        description: null,
        exclusiveMaximum: null,
        exclusiveMinimum: null,
        format: null,
        key: 'date',
        maxLength: null,
        maximum: null,
        minLength: null,
        minimum: null,
        name: '日期',
        options: null,
        pattern: null,
        primary: null,
        properties: null,
        required: null,
        type: 'date',
      },
      {
        description: null,
        exclusiveMaximum: null,
        exclusiveMinimum: null,
        format: null,
        key: 'copId',
        maxLength: null,
        maximum: null,
        minLength: null,
        minimum: null,
        name: '公司',
        options: [
          {
            label: '12323232',
            value: '1',
          },
          {
            label: 'bbbbbbb',
            value: '2',
          },
        ],
        pattern: null,
        primary: null,
        properties: null,
        refObjectId: '5f9630d977b9ec42e4d0dca5',
        required: null,
        titleKey: 'name',
        type: 'singleOption',
        unique: null,
        unBasic: true,
      },
    ],

    filterFieldService: {
      findOptions: (key, name) => findOptions(key, name),
      findOfValues: (key, value) => findOfValues(key, value),
      findDataTrees: (key, parentId) => findDataTrees(key, parentId),
    },
  }

  const [value, setValue] = useState([
    {
      source: 'deptId',
      op: '$eq',
      target: '1',
    },
  ])
  const handleFilter = useCallback(
    (logicFilter: IUncheckLogicFilter) => setValue(logicFilter),
    []
  )
  return (
    <div>
      <FilterBuilder
        filterFieldMetas={filter.filterFieldMetas}
        value={value}
        filterFieldService={filter.filterFieldService}
        onChange={(filterItem: Partial<ICompareOperation>[]) =>
          handleFilter(filterItem)
        }
        logicFitler
      />
    </div>
  )
}
```

<API></API>
