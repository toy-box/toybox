## Segment 字段内容区块

#### 基本用法

```tsx
import React from 'react'
import { Segment } from '@toy-box/toybox-ui'
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
import { Form, Input } from 'antd'
import { Segment, FieldRow, HorizontalRule } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

export default () => {
  return (
    <>
      <Segment title="区块A" key="a" collapsible>
        <FieldRow key="1">
          <Form.Item label="文本字段">
            <Input />
          </Form.Item>
          <Form.Item label="数字字段">
            <Input />
          </Form.Item>
        </FieldRow>
        <HorizontalRule type="dashed" />
        <FieldRow key="2">
          <Form.Item label="文本字段">
            <Input />
          </Form.Item>
          <Form.Item label="数字字段">
            <Input />
          </Form.Item>
        </FieldRow>
      </Segment>
    </>
  )
}
```
