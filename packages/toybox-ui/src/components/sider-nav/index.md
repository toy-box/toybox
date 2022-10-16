## SiderNav 侧边导航条

Demo:

```tsx
import React from 'react'
import {
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import { SiderNav } from '@toy-box/toybox-ui'
import 'antd/dist/antd.css'

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('Option 3', '3', <ContainerOutlined />),
]

export default () => {
  return (
    <div>
      <SiderNav
        menu={{
          mode: 'inline',
          items: items,
        }}
        toggle={{ top: 200 }}
      />
    </div>
  )
}
```
