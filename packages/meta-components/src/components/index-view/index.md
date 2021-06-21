#### 基本用法

```tsx
import React, { useMemo } from 'react'
import { IndexView } from '@toy-box/meta-components'
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
      idKey: 'id',
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
  const loadData = ({ current, pageSize }) => {
    const result = {
      list: data,
      total: 20,
      current,
      pageSize,
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

  return (
    <IndexView
      style={{ minWidth: '600px' }}
      visibleColumns={visibleColumns}
      objectMeta={objectMeta}
      loadData={loadData}
      simple
    />
  )
}
```

#### 基本用法

```tsx
import React, { useMemo } from 'react'
import {
  IndexView,
  FilterPanel,
  TableStatusBar,
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
      idKey: 'id',
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
  const loadData = ({ current, pageSize }, filterParams) => {
    console.log('loadData', current, pageSize, filterParams)
    const result = {
      list: data,
      total: 20,
      current,
      pageSize,
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

  return (
    <IndexView
      style={{ minWidth: '600px' }}
      visibleColumns={visibleColumns}
      objectMeta={objectMeta}
      loadData={loadData}
      defaultSelectionType="checkbox"
      logicFilter
    >
      <FilterPanel simpleFilterKeys={['name', 'billCycle']} />
      <TableStatusBar />
    </IndexView>
  )
}
```
