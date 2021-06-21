## Segment 字段内容区块

#### 基本用法

```tsx
import React from 'react'
import { Form, Space, Input, NumberPicker } from 'antd'
import { Segment, Row } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

export default () => {
  return (
    <Segment title="区块A">
      <Row key="1">
        <Space>
          <Form.Item label="文本字段">
            <Input />
          </Form.Item>
          <Form.Item label="数字字段">
            <NumberPicker />
          </Form.Item>
        </Space>
      </Row>
      <Row key="2">
        <div>aaa</div>
        <div>bbb</div>
        <div>ccc</div>
      </Row>
    </Segment>
  )
}
```

<!-- ### 开启展开收缩

```tsx
import React from 'react'
import { Form, Space, Input } from 'antd'
import { Segment, Row } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

export default () => {
  return (
    <>
      <Segment title="区块A" key="a" collapsible>
        <Row key="1">
          <Space>
            <Form.Item label="文本字段">
              <Input />
            </Form.Item>
            <Form.Item label="数字字段">
              <Input />
            </Form.Item>
          </Space>
        </Row>
        <Row key="2">
          <div>aaa</div>
          <div>bbb</div>
          <div>ccc</div>
        </Row>
      </Segment>
      <Segment title="区块B" key="b" collapsible>
        <Row key="1">
          <Space>
            <Form.Item label="文本字段">
              <Input />
            </Form.Item>
            <Form.Item label="数字字段">
              <Input />
            </Form.Item>
          </Space>
        </Row>
        <Row key="2">
          <div>xxx</div>
          <div>yyy</div>
          <div>zzz</div>
        </Row>
      </Segment>
    </>
  )
}
``` -->
