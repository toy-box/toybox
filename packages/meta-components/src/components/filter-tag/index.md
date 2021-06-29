## FilterTag 筛选条件标签

#### 基本用法

```tsx
import React, { useCallback, useState } from 'react'
import { FilterTag } from '@toy-box/meta-components'
import 'antd/dist/antd.css'

export default () => {
  const fieldMeta = {
    type: 'singleOption',
    name: '选项',
    options: [
      {
        label: '选项1',
        value: '1',
      },
      {
        label: '选项2',
        value: '2',
      },
      {
        label: '选项3',
        value: '3',
      },
    ],
  }

  const fieldMetaDate = {
    type: 'date',
    name: '日期',
  }

  const fieldMetaDatetime = {
    type: 'datetime',
    name: '日期时间',
  }

  const fieldMetaObject = {
    type: 'objectId',
    name: '远程对象',
    refObject: 'remote_object',
  }

  const compare = {
    source: 'option',
    op: '$eq',
    target: '1',
  }

  const compare1 = {
    source: 'option',
    op: '$in',
    target: ['1', '2'],
  }

  const comparDate = {
    source: 'date',
    op: '$gt',
    target: '2020/1/1',
  }

  const comparDate2 = {
    source: 'date',
    op: '$between',
    target: ['2020/1/1', '2020/10/1'],
  }

  const comparDatetime = {
    source: 'datetime',
    op: '$gt',
    target: '2020/1/1 12:00',
  }

  const comparDaterange = {
    source: 'date',
    op: '$unitDateRange',
    target: 'DAY:-1:-1',
  }

  const comparDaterange2 = {
    source: 'date',
    op: '$unitDateRange',
    target: 'MONTH:1:1',
  }

  const compareObject = {
    source: 'object',
    op: '$in',
    target: ['1', '2'],
  }

  const remote = (value: (string | number)[]) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value.map((v) => ({ label: `label-${v}`, value: v })))
      }, 300)
    })
  }

  return (
    <div>
      <FilterTag
        key="1"
        style={{ width: '100px' }}
        compare={compare}
        fieldMeta={fieldMeta}
        ellipsis
        remove={console.log}
      />
      <FilterTag
        key="2"
        style={{ width: '140px' }}
        compare={compare1}
        fieldMeta={fieldMeta}
        ellipsis
      />
      <FilterTag
        key="3"
        style={{ width: '140px' }}
        compare={comparDate}
        fieldMeta={fieldMetaDate}
        ellipsis
      />
      <FilterTag
        key="4"
        style={{ width: '240px' }}
        compare={comparDate2}
        fieldMeta={fieldMetaDate}
        ellipsis
      />
      <FilterTag
        key="5"
        style={{ width: '200px' }}
        compare={comparDatetime}
        fieldMeta={fieldMetaDatetime}
        ellipsis
      />
      <FilterTag
        key="6"
        style={{ width: '80px' }}
        compare={comparDaterange}
        fieldMeta={fieldMetaDate}
        ellipsis
      />
      <FilterTag
        key="7"
        style={{ width: '80px' }}
        compare={comparDaterange2}
        fieldMeta={fieldMetaDate}
        ellipsis
      />
      <FilterTag
        key="8"
        style={{ width: '120px' }}
        compare={compareObject}
        fieldMeta={fieldMetaObject}
        remote={remote}
        ellipsis
      />
    </div>
  )
}
```
