## Text 文本

### 基本用法

```tsx
import React from 'react'
import { Space } from 'antd'
import { Text } from '@toy-box/toybox-ui'

export default () => {
  return (
    <Space direction="vertical">
      <Text type="H1">Title H1</Text>
      <Text type="H2">Title H2</Text>
      <Text type="H3">Title H3</Text>
      <Text type="text" color="success">
        text success
      </Text>
      <Text type="text" mark>
        text mark
      </Text>
      <Text type="text" delete>
        text delete
      </Text>
      <Text type="text" strong>
        text strong
      </Text>
      <Text type="text" italic>
        text italic
      </Text>
    </Space>
  )
}
```
