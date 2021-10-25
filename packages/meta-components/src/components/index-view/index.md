## DataGrid

#### 基本用法

```tsx
import React, { useCallback, useMemo, useRef } from 'react'
import {
  DataGrid,
  FilterDisplay,
  FilterPanel,
  TableStatusBar,
} from '@toy-box/meta-components'
import { Button } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

const objectMeta = {
  key: 'bill',
  name: '账单',
  description: '账单',
  properties: {
    id: {
      key: 'id',
      name: 'ID',
      description: 'ID',
      type: 'string',
    },
    name: {
      key: 'name',
      name: '名称',
      type: 'string',
    },
    billCycle: {
      key: 'billCycle',
      name: '账期',
      type: 'date',
    },
    amount: {
      key: 'amount',
      name: '金额',
      type: 'number',
    },
    user: {
      key: 'user',
      name: '用户',
      type: 'object',
      titleKey: 'name',
      primaryKey: 'id',
      properties: {
        id: {
          key: 'id',
          name: 'ID',
          type: 'string',
        },
        name: {
          key: 'name',
          name: '用户名',
          type: 'string',
        },
      },
    },
  },
  titleKey: 'name',
}

const data = [
  {
    id: '1234',
    name: '特殊',
    billCycle: '2020-01-01',
    amount: 2000,
    user: {
      id: 'xxx',
      name: '熊丽',
    },
  },
  {
    id: '1235',
    name: '销售',
    billCycle: '2020-02-01',
    amount: 1300,
    user: {
      id: 'xxx2',
      name: '熊丽2',
    },
  },
  {
    id: '1236',
    name: '实收',
    billCycle: '2020-03-03',
    amount: 1500,
    user: {
      id: 'xxx3',
      name: '熊丽2',
    },
  },
  {
    id: '1237',
    name: '实收',
    billCycle: '2020-03-03',
    amount: 1500,
    user: {
      id: 'xxx4',
      name: '鲁特',
    },
  },
  {
    id: '1238',
    name: '实收',
    billCycle: '2020-04-03',
    amount: 2300,
    user: {
      id: 'xxx5',
      name: '魔偶',
    },
  },
  {
    id: '1239',
    name: '实收',
    billCycle: '2020-04-03',
    amount: 2400,
    user: {
      id: 'xxx6',
      name: '魔偶1',
    },
  },
  {
    id: '1240',
    name: '应收',
    billCycle: '2020-04-03',
    amount: 2400,
    user: {
      id: 'xxx6',
      name: '魔偶3',
    },
  },
]

const visibleColumns = [
  {
    key: 'name',
    visiable: true,
    fixed: true,
  },
  {
    key: 'user',
    visiable: true,
  },
  {
    key: 'billCycle',
    visiable: true,
  },
  {
    key: 'amount',
    visiable: true,
  },
]

export default () => {
  const ref = useRef()
  const loadData = (pageable, params) => {
    const result = {
      list: data.map((row) => ({
        ...row,
        name: `${row.name}-${pageable?.current || '1'}`,
      })),
      total: 20,
      current: pageable?.current || 1,
      pageSize: pageable?.pageSize || 10,
    }
    const promise = new Promise<{
      list: Record<string, any>[]
      total: number
      current: number
      pageSize: number
    }>(function (resolve) {
      setTimeout(function () {
        console.log('load...', result)
        resolve(result)
      }, 1000)
    })
    return promise
  }

  const reload = useCallback(() => {
    ref.current.reload()
  }, [ref])

  const reset = useCallback(() => {
    ref.current.reset()
  }, [ref])

  return (
    <>
      <DataGrid
        ref={ref}
        style={{ minWidth: '600px' }}
        visibleColumns={visibleColumns}
        objectMeta={objectMeta}
        loadData={loadData}
        pagination={{ current: 1, pageSize: 10 }}
        urlQuery
        tableOption={{ scroll: { x: 1000 } }}
      >
        <FilterPanel simpleFilterKeys={['amount']} />
        <TableStatusBar />
      </DataGrid>
      <Button onClick={reload}>重新读取数据</Button>
      <Button onClick={reset}>重置</Button>
    </>
  )
}
```

#### 开启多选

```tsx
import React, { useMemo } from 'react'
import { message } from 'antd'
import {
  DataGrid,
  FilterPanel,
  TableStatusBar,
  OperatePanel,
  FilterDisplay,
} from '@toy-box/meta-components'
import { ToolBar } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

const objectMeta = {
  key: 'bill',
  name: '账单',
  description: '账单',
  properties: {
    id: {
      key: 'id',
      name: 'ID',
      description: 'ID',
      type: 'string',
    },
    name: {
      key: 'name',
      name: '名称',
      type: 'string',
    },
    billCycle: {
      key: 'billCycle',
      name: '账期',
      type: 'date',
    },
    amount: {
      key: 'amount',
      name: '金额',
      type: 'number',
    },
    user: {
      key: 'user',
      name: '用户',
      type: 'object',
      titleKey: 'name',
      primaryKey: 'id',
      properties: {
        id: {
          key: 'id',
          name: 'ID',
          type: 'string',
        },
        name: {
          key: 'name',
          name: '用户名',
          type: 'string',
        },
      },
    },
  },
  titleKey: 'name',
}

const data = [
  {
    id: '1234',
    name: '销售',
    billCycle: '2020-01-01',
    amount: 2000,
    user: {
      id: 'xxx',
      name: '熊丽',
    },
  },
  {
    id: '1235',
    name: '销售',
    billCycle: '2020-02-01',
    amount: 1300,
    user: {
      id: 'xxx2',
      name: '熊丽2',
    },
  },
  {
    id: '1236',
    name: '实收',
    billCycle: '2020-03-03',
    amount: 1500,
    user: {
      id: 'xxx3',
      name: '熊丽2',
    },
  },
  {
    id: '1237',
    name: '实收',
    billCycle: '2020-03-03',
    amount: 1500,
    user: {
      id: 'xxx4',
      name: '鲁特',
    },
  },
  {
    id: '1238',
    name: '实收',
    billCycle: '2020-04-03',
    amount: 2300,
    user: {
      id: 'xxx5',
      name: '魔偶',
    },
  },
  {
    id: '1239',
    name: '实收',
    billCycle: '2020-04-03',
    amount: 2400,
    user: {
      id: 'xxx6',
      name: '魔偶1',
    },
  },
  {
    id: '1240',
    name: '应收',
    billCycle: '2020-04-03',
    amount: 2400,
    user: {
      id: 'xxx6',
      name: '魔偶3',
    },
  },
]

const visibleColumns = [
  {
    key: 'name',
    visiable: true,
    fixed: true,
  },
  {
    key: 'billCycle',
    visiable: true,
  },
  {
    key: 'amount',
    visiable: true,
  },
  {
    key: 'user',
    visiable: true,
  },
]

export default () => {
  const loadData = (pageable, filterParams) => {
    const result = {
      list: data,
      total: 20,
      current: pageable?.current || 1,
      pageSize: pageable?.pageSize || 10,
    }
    const promise = new Promise<{
      list: Record<string, any>[]
      total: number
      current: number
      pageSize: number
    }>(function (resolve) {
      setTimeout(function () {
        resolve(result)
      }, 1000)
    })
    return promise
  }

  const items = [
    {
      text: '按钮1',
      type: 'primary',
      callback: () => message.success('按钮1被点了'),
    },
    {
      text: '打印选择行',
      type: 'danger',
      disabled: (interView) => (interView.selectedRowKeys || []).length === 0,
      callback: (interView) =>
        message.success(
          `${(interView.selectedRowKeys || []).length} 条记录被选中了`
        ),
    },
  ]

  const tableOperate = {
    items: [
      {
        text: 'view',
        type: 'primary',
        size: 'small',
        callback: (text, record, index) => console.log(text, record, index),
      },
      {
        text: 'edit',
        type: 'dashed',
        size: 'small',
        callback: (text, record, index) => console.log(text, record, index),
      },
      {
        text: 'remove',
        type: 'text',
        size: 'small',
        danger: true,
        callback: (text, record, index) => console.log(text, record, index),
      },
    ],
  }

  return (
    <DataGrid
      style={{ minWidth: '600px' }}
      visibleColumns={visibleColumns}
      objectMeta={objectMeta}
      loadData={loadData}
      defaultSelectionType="checkbox"
      tableOperate={tableOperate}
      logicFilter
    >
      <ToolBar>
        <FilterPanel />
        <OperatePanel items={items} />
      </ToolBar>
      <FilterDisplay />
      <TableStatusBar />
    </DataGrid>
  )
}
```

#### 搜素字段自定义

```tsx
import React, { useMemo } from 'react'
import {
  DataGrid,
  FilterPanel,
  TableStatusBar,
  FilterDisplay,
} from '@toy-box/meta-components'
import 'antd/dist/antd.css'

const objectMeta = {
  key: 'bill',
  name: '账单',
  description: '账单',
  properties: {
    id: {
      key: 'id',
      name: 'ID',
      description: 'ID',
      type: 'string',
    },
    name: {
      key: 'name',
      name: '名称',
      type: 'string',
    },
    billCycle: {
      key: 'billCycle',
      name: '账期',
      type: 'date',
    },
    amount: {
      key: 'amount',
      name: '金额',
      type: 'number',
    },
    user: {
      key: 'user',
      name: '用户',
      type: 'object',
      titleKey: 'name',
      primaryKey: 'id',
      properties: {
        id: {
          key: 'id',
          name: 'ID',
          type: 'string',
        },
        name: {
          key: 'name',
          name: '用户名',
          type: 'string',
        },
      },
    },
  },
  titleKey: 'name',
}

const data = [
  {
    id: '1234',
    name: '销售',
    billCycle: '2020-01-01',
    amount: 2000,
    user: {
      id: 'xxx',
      name: '熊丽',
    },
  },
  {
    id: '1235',
    name: '销售',
    billCycle: '2020-02-01',
    amount: 1300,
    user: {
      id: 'xxx2',
      name: '熊丽2',
    },
  },
  {
    id: '1236',
    name: '实收',
    billCycle: '2020-03-03',
    amount: 1500,
    user: {
      id: 'xxx3',
      name: '熊丽2',
    },
  },
  {
    id: '1237',
    name: '实收',
    billCycle: '2020-03-03',
    amount: 1500,
    user: {
      id: 'xxx4',
      name: '鲁特',
    },
  },
  {
    id: '1238',
    name: '实收',
    billCycle: '2020-04-03',
    amount: 2300,
    user: {
      id: 'xxx5',
      name: '魔偶',
    },
  },
  {
    id: '1239',
    name: '实收',
    billCycle: '2020-04-03',
    amount: 2400,
    user: {
      id: 'xxx6',
      name: '魔偶1',
    },
  },
  {
    id: '1240',
    name: '应收',
    billCycle: '2020-04-03',
    amount: 2400,
    user: {
      id: 'xxx6',
      name: '魔偶3',
    },
  },
]

const visibleColumns = [
  {
    key: 'name',
    visiable: true,
  },
  {
    key: 'billCycle',
    visiable: true,
  },
  {
    key: 'amount',
    visiable: true,
  },
  {
    key: 'user',
    visiable: true,
  },
]

const makeData = (current) => {
  return data.map((row) => ({
    ...row,
    id: `${current}-${row.id}`,
    name: `${current}-${row.name}`,
  }))
}

export default () => {
  const loadData = (pageable, filterParams) => {
    const result = {
      list: makeData(pageable?.current || 1),
      total: 20,
      current: pageable?.current || 1,
      pageSize: pageable?.pageSize || 10,
    }
    const promise = new Promise<{
      list: Record<string, any>[]
      total: number
      current: number
      pageSize: number
    }>(function (resolve) {
      setTimeout(function () {
        resolve(result)
      }, 1000)
    })
    return promise
  }

  const fiterFieldMetas = [
    {
      key: 'key-1',
      type: 'singleOption',
      name: '单选',
      options: [
        {
          label: '选项1',
          value: 'opt-1',
        },
        {
          label: '选项2',
          value: 'opt-2',
        },
        {
          label: '选项3',
          value: 'opt-3',
        },
      ],
    },
    {
      key: 'key-2',
      type: 'string',
      name: '日期字符串',
      format: 'date',
    },
    {
      key: 'key-3',
      type: 'date',
      name: '日期',
    },
    {
      key: 'key-4',
      type: 'string',
      name: '名称',
    },
  ]

  return (
    <DataGrid
      style={{ minWidth: '600px' }}
      visibleColumns={visibleColumns}
      objectMeta={objectMeta}
      loadData={loadData}
      defaultSelectionType="checkbox"
      pagination={{ simple: true }}
      overPageSelect
    >
      <FilterPanel
        fieldMetas={fiterFieldMetas}
        simpleFilterKeys={['key-2', 'key-4', 'key-1']}
      />
      <FilterDisplay fieldMetas={fiterFieldMetas} />
      <TableStatusBar />
    </DataGrid>
  )
}
```

#### 高级模式 当请求数据的接口按 MetaRepository 的 ILogicFilter

```tsx
import React, { useMemo } from 'react'
import {
  DataGrid,
  FilterPanel,
  TableStatusBar,
  FilterDisplay,
} from '@toy-box/meta-components'
import 'antd/dist/antd.css'

const objectMeta = {
  key: 'bill',
  name: '账单',
  description: '账单',
  properties: {
    id: {
      key: 'id',
      name: 'ID',
      description: 'ID',
      type: 'string',
    },
    name: {
      key: 'name',
      name: '名称',
      type: 'string',
    },
    billCycle: {
      key: 'billCycle',
      name: '账期',
      type: 'date',
    },
    amount: {
      key: 'amount',
      name: '金额',
      type: 'number',
    },
    user: {
      key: 'user',
      name: '用户',
      type: 'object',
      titleKey: 'name',
      primaryKey: 'id',
      properties: {
        id: {
          key: 'id',
          name: 'ID',
          type: 'string',
        },
        name: {
          key: 'name',
          name: '用户名',
          type: 'string',
        },
      },
    },
  },
  titleKey: 'name',
}

const data = [
  {
    id: '1234',
    name: '销售',
    billCycle: '2020-01-01',
    amount: 2000,
    user: {
      id: 'xxx',
      name: '熊丽',
    },
  },
  {
    id: '1235',
    name: '销售',
    billCycle: '2020-02-01',
    amount: 1300,
    user: {
      id: 'xxx2',
      name: '熊丽2',
    },
  },
  {
    id: '1236',
    name: '实收',
    billCycle: '2020-03-03',
    amount: 1500,
    user: {
      id: 'xxx3',
      name: '熊丽2',
    },
  },
  {
    id: '1237',
    name: '实收',
    billCycle: '2020-03-03',
    amount: 1500,
    user: {
      id: 'xxx4',
      name: '鲁特',
    },
  },
  {
    id: '1238',
    name: '实收',
    billCycle: '2020-04-03',
    amount: 2300,
    user: {
      id: 'xxx5',
      name: '魔偶',
    },
  },
  {
    id: '1239',
    name: '实收',
    billCycle: '2020-04-03',
    amount: 2400,
    user: {
      id: 'xxx6',
      name: '魔偶1',
    },
  },
  {
    id: '1240',
    name: '应收',
    billCycle: '2020-04-03',
    amount: 2400,
    user: {
      id: 'xxx6',
      name: '魔偶3',
    },
  },
]

const visibleColumns = [
  {
    key: 'name',
    visiable: true,
  },
  {
    key: 'billCycle',
    visiable: true,
  },
  {
    key: 'amount',
    visiable: true,
  },
  {
    key: 'user',
    visiable: true,
  },
]

export default () => {
  const loadData = (pageable, filterParams) => {
    const result = {
      list: data,
      total: 20,
      current: pageable?.current || 1,
      pageSize: pageable?.pageSize || 10,
    }
    const promise = new Promise<{
      list: Record<string, any>[]
      total: number
      current: number
      pageSize: number
    }>(function (resolve) {
      setTimeout(function () {
        resolve(result)
      }, 1000)
    })
    return promise
  }

  const fiterFieldMetas = [
    {
      key: 'key-1',
      type: 'singleOption',
      name: '单选',
      options: [
        {
          label: '选项1',
          value: 'opt-1',
        },
        {
          label: '选项2',
          value: 'opt-2',
        },
        {
          label: '选项3',
          value: 'opt-3',
        },
      ],
    },
    {
      key: 'key-2',
      type: 'string',
      name: '日期字符串',
      format: 'date',
    },
    {
      key: 'key-3',
      type: 'date',
      name: '日期',
    },
    {
      key: 'key-4',
      type: 'string',
      name: '名称',
    },
  ]

  return (
    <DataGrid
      style={{ minWidth: '600px' }}
      visibleColumns={visibleColumns}
      objectMeta={objectMeta}
      loadData={loadData}
      defaultSelectionType="checkbox"
      logicFilter
    >
      <FilterPanel
        fieldMetas={fiterFieldMetas}
        simpleFilterKeys={['key-2', 'key-4', 'key-1']}
      />
      <FilterDisplay fieldMetas={fiterFieldMetas} />
      <TableStatusBar />
    </DataGrid>
  )
}
```
