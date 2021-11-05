import React, { CSSProperties, FC } from 'react'
import { Typography } from 'antd'
import { BlockProps, BaseType } from 'antd/es/typography/Base'

export type TextType = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'Text' | 'Paragraph'

export interface ITextProps
  extends Omit<BlockProps, 'type' | 'editable' | 'copyable'> {
  type: TextType
  style?: CSSProperties
  color?: BaseType
}

export const Text: FC<ITextProps> = ({
  type,
  color,
  style,
  children,
  ...otherProps
}) => {
  switch (type) {
    case 'H1':
      return (
        <Typography.Title level={1} style={style} type={color} {...otherProps}>
          {children}
        </Typography.Title>
      )
    case 'H2':
      return (
        <Typography.Title level={2} style={style} type={color} {...otherProps}>
          {children}
        </Typography.Title>
      )
    case 'H3':
      return (
        <Typography.Title level={3} style={style} type={color} {...otherProps}>
          {children}
        </Typography.Title>
      )
    case 'H4':
      return (
        <Typography.Title level={4} style={style} type={color} {...otherProps}>
          {children}
        </Typography.Title>
      )
    case 'H5':
      return (
        <Typography.Title level={5} style={style} type={color} {...otherProps}>
          {children}
        </Typography.Title>
      )
    case 'Paragraph':
      return (
        <Typography.Paragraph style={style} type={color} {...otherProps}>
          {children}
        </Typography.Paragraph>
      )
    default:
      return (
        <Typography.Text style={style} type={color} {...otherProps}>
          {children}
        </Typography.Text>
      )
  }
}
