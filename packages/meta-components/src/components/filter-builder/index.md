## FilterBuilder

### 基础用法

```tsx
import React, { useCallback, useState, useMemo } from 'react'
import { FilterBuilder } from '@toy-box/meta-components'
import 'antd/dist/antd.css'

const departments = [
  {
    id: 'dep1',
    name: 'DEP1',
    pId: 0,
    isLeaf: false,
  },
  {
    id: 'dep2_1',
    name: 'DEP2-1',
    pId: 'dep1',
    isLeaf: false,
  },
  {
    id: 'dep2_2',
    name: 'DEP2-2',
    pId: 'dep1',
    isLeaf: true,
  },
  {
    id: 'dep2_1_1',
    name: 'DEP2-1-1',
    pId: 'dep2_1',
    isLeaf: true,
  },
]

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
      if (key === 'department')
        return departments
          .filter((dept) => value.some((v) => v === dept.id))
          .map((dept) => ({
            label: dept.name,
            value: dept.id,
            pId: dept.pId,
            isLeaf: dept.isLeaf,
          }))
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
    console.log('findDataTrees', key, parentId)
    return new Promise((resolve) => {
      serviceTest(resolve, key)
    }).then((res) => {
      if (key === 'department') {
        if (parentId == null || parentId === '' || parentId === 0) {
          return departments
            .filter((dept) => dept.pId === 0)
            .map((dept) => ({
              id: dept.id,
              label: dept.name,
              value: dept.id,
              pId: dept.pId,
              isLeaf: dept.isLeaf,
            }))
        }
        return departments
          .filter((dept) => dept.pId === parentId)
          .map((dept) => ({
            id: dept.id,
            label: dept.name,
            value: dept.id,
            pId: dept.pId,
            isLeaf: dept.isLeaf,
          }))
      }
    })
  }

  const filter = {
    filterFieldMetas: [
      {
        description: null,
        exclusiveMaximum: null,
        exclusiveMinimum: null,
        format: null,
        key: 'department',
        maxLength: null,
        maximum: null,
        minLength: null,
        minimum: null,
        name: '部门',
        options: null,
        parentKey: 'pid',
        pattern: null,
        primary: null,
        properties: null,
        refRegisterId: '5f9630d977b9ec42e4d0dca5',
        required: null,
        titleKey: 'name',
        type: 'refId',
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
        refRegisterId: '5f9630d977b9ec42e4d0dca5',
        required: null,
        titleKey: 'name',
        type: 'singleOption',
        unique: null,
        unBasic: true,
        operatOptions: [
          {
            label: '添加',
            value: 'add',
          },
        ],
      },
    ],

    filterFieldService: {
      findOptions: (key, name) => findOptions(key, name),
      findOfValues: (key, value) => findOfValues(key, value),
      findDataTrees: (key, parentId) => findDataTrees(key, parentId),
    },
  }

  const [value, setValue] = useState([])
  const handleFilter = useCallback(
    (logicFilter: IUncheckLogicFilter, index) => {
      setValue(logicFilter)
      console.log(index)
    },
    []
  )
  const customValueElement = useMemo(() => {
    return <div>123213123</div>
  }, [])
  return (
    <div>
      <FilterBuilder
        fieldMetas={filter.filterFieldMetas}
        value={value}
        operatType="replace"
        // customValueElement={customValueElement}
        filterFieldService={filter.filterFieldService}
        onChange={(filterItem: Partial<ICompareOperation>[], index?: number) =>
          handleFilter(filterItem, index)
        }
      />
    </div>
  )
}
```

### 垂直模式

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
    console.log('findOfValues', key, name)
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
        return [{ id: '2', value: '1', title: 'Expand to load2' }]
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
        refRegisterId: '5f9630d977b9ec42e4d0dca5',
        required: null,
        titleKey: 'name',
        type: 'refId',
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
        refRegisterId: '5f9630d977b9ec42e4d0dca5',
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

  const [value, setValue] = useState([])
  const handleFilter = useCallback(
    (logicFilter: IUncheckLogicFilter) => setValue(logicFilter),
    []
  )
  return (
    <div>
      <FilterBuilder
        fieldMetas={filter.filterFieldMetas}
        value={value}
        filterFieldService={filter.filterFieldService}
        onChange={(filterItem: Partial<ICompareOperation>[]) =>
          handleFilter(filterItem)
        }
        layout="vertical"
      />
    </div>
  )
}
```

### 特殊模式

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
      if (key === 'deptId') {
        return [{ id: '2', pId: '1', value: '1', title: 'Expand to load2' }]
      }
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
        refRegisterId: '5f9630d977b9ec42e4d0dca5',
        required: null,
        titleKey: 'name',
        type: 'refId',
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
            label: '变量',
            value: 'var',
            children: [
              {
                label: '变量1',
                value: 'var1',
              },
              {
                label: '变量2',
                value: 'var2',
              },
            ],
          },
          {
            label: '常量',
            value: 'const',
            children: [
              {
                label: '常量1',
                value: 'const1',
              },
              {
                label: '常量2',
                value: 'const2',
              },
            ],
          },
        ],
        pattern: null,
        primary: null,
        properties: null,
        refRegisterId: '5f9630d977b9ec42e4d0dca5',
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

  const filter1 = {
    filterFieldMetas: [
      {
        label: '变量',
        value: 'var',
        children: [
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
            refRegisterId: '5f9630d977b9ec42e4d0dca5',
            required: null,
            titleKey: 'name',
            type: 'refId',
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
            options: [
              {
                label: '常量',
                value: 'const',
                children: [
                  {
                    label: '时间',
                    value: 'time1',
                    disabled: true,
                  },
                  {
                    label: '时间2',
                    value: 'time2',
                  },
                ],
              },
            ],
            pattern: null,
            primary: null,
            properties: null,
            required: null,
            type: 'percent',
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
                label: '变量',
                value: 'var',
                children: [
                  {
                    label: '变量1',
                    value: 'var1',
                    disabled: true,
                  },
                  {
                    label: '变量2',
                    value: 'var2',
                  },
                ],
              },
              {
                label: '常量',
                value: 'const',
                children: [
                  {
                    label: '常量1',
                    value: 'const1',
                  },
                  {
                    label: '常量2',
                    value: 'const2',
                  },
                ],
              },
            ],
            pattern: null,
            primary: null,
            properties: null,
            refRegisterId: '5f9630d977b9ec42e4d0dca5',
            required: null,
            titleKey: 'name',
            type: 'singleOption',
            unique: null,
            unBasic: true,
          },
        ],
      },
      {
        label: '集合变量',
        value: 'var',
        children: [
          {
            description: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            format: null,
            key: 'connent1',
            maxLength: null,
            maximum: null,
            minLength: null,
            minimum: null,
            name: '集合',
            options: null,
            parentKey: 'parent_id',
            pattern: null,
            primary: null,
            properties: null,
            refObjectId: '5f9630d977b9ec42e4d0dca5',
            required: null,
            titleKey: 'name',
            items: {
              type: 'string',
            },
            type: 'array',
            unique: null,
            unBasic: true,
          },
        ],
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
      type: 'INPUT',
      target: '1',
    },
  ])
  const specialOptions = [
    {
      label: '引用变量',
      value: 'REFERENCE',
    },
    {
      label: '直接输入',
      value: 'INPUT',
    },
  ]
  const quoteOptions = [
    {
      label: '变量',
      value: 'var',
      children: [
        {
          label: '变量1',
          value: 'var1',
          key: 'deptId',
        },
        {
          label: '变量2',
          value: 'var2',
          key: 'date',
        },
      ],
    },
    {
      label: '常量',
      value: 'const',
      children: [
        {
          label: '常量1',
          value: 'const1',
        },
        {
          label: '常量2',
          value: 'const2',
          key: 'copId',
        },
      ],
    },
  ]
  const handleFilter = useCallback(
    (logicFilter: IUncheckLogicFilter) => setValue(logicFilter),
    []
  )
  return (
    <div>
      <FilterBuilder
        fieldMetas={filter1.filterFieldMetas}
        value={value}
        filterFieldService={filter.filterFieldService}
        onChange={(filterItem: Partial<ICompareOperation>[]) =>
          handleFilter(filterItem)
        }
        specialMode
        specialOptions={specialOptions}
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
        return [{ id: '2', value: '1', title: 'Expand to load2' }]
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
        refRegisterId: '5f9630d977b9ec42e4d0dca5',
        required: null,
        titleKey: 'name',
        type: 'refId',
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
        refRegisterId: '5f9630d977b9ec42e4d0dca5',
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

  const [value, setValue] = useState([])
  const handleFilter = useCallback(
    (logicFilter: IUncheckLogicFilter) => setValue(logicFilter),
    []
  )
  return (
    <div>
      <FilterBuilder
        fieldMetas={filter.filterFieldMetas}
        value={value}
        filterFieldService={filter.filterFieldService}
        onChange={(filterItem: Partial<ICompareOperation>[]) =>
          handleFilter(filterItem)
        }
        simple
      />
    </div>
  )
}
```

<API></API>
