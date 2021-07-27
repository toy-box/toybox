## FieldRow 字段内容区块

### 基本用法

```tsx
import React from 'react'
import { Form, Space, Input } from 'antd'
import { FieldRow } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

export default () => {
  return (
    <div>
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
        <Space>
          <Form.Item label="文本字段">
            <Input />
          </Form.Item>
          <Form.Item label="数字字段">
            <Input />
          </Form.Item>
        </Space>
      </FieldRow>
    </div>
  )
}
```
