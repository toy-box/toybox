## Segment 字段内容区块

#### 基本用法

```tsx
import React from 'react'
import { Form, Space, Input, NumberPicker } from 'antd'
import { Segment, FieldRow } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

export default () => {
  return (
    <Segment title="区块A">
      <p>111sdfs df</p>
    </Segment>
  )
}
```

### 开启展开收缩

```tsx
import React from 'react'
import { Form, Space, Input } from 'antd'
import { Segment, FieldRow } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

export default () => {
  return (
    <>
      <Segment title="区块A" key="a" collapsible>
        <FieldRow key="1">
          <Space>
            <Form.Item label="文本字段">
              <Input />
            </Form.Item>
            <Form.Item label="数字字段">
              <Input />
            </Form.Item>
          </Space>
        </FieldRow>
        <FieldRow key="2">
          <div>aaa</div>
          <div>bbb</div>
          <div>ccc</div>
        </FieldRow>
      </Segment>
    </>
  )
}
```
