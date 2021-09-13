import React, { FC } from 'react'
import { Typography } from 'antd'

export type TextType = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'Text' | 'Paragraph'

export interface ITextProps {
  type: TextType
  italic?: boolean
  underline?: boolean
  strong?: boolean
  color?: string
}

export const Text: FC<ITextProps> = ({
  type,
  italic,
  underline,
  strong,
  color,
  children,
}) => {
  const style: React.CSSProperties = { color }
  switch (type) {
    case 'H1':
      return (
        <Typography.Title
          level={1}
          italic={italic}
          underline={underline}
          style={style}
        >
          {children}
        </Typography.Title>
      )
    case 'H2':
      return (
        <Typography.Title
          level={2}
          italic={italic}
          underline={underline}
          style={style}
        >
          {children}
        </Typography.Title>
      )
    case 'H3':
      return (
        <Typography.Title
          level={3}
          italic={italic}
          underline={underline}
          style={style}
        >
          {children}
        </Typography.Title>
      )
    case 'H4':
      return (
        <Typography.Title
          level={4}
          italic={italic}
          underline={underline}
          style={style}
        >
          {children}
        </Typography.Title>
      )
    case 'H5':
      return (
        <Typography.Title
          level={5}
          italic={italic}
          underline={underline}
          style={style}
        >
          {children}
        </Typography.Title>
      )
    case 'Paragraph':
      return (
        <Typography.Paragraph
          italic={italic}
          underline={italic}
          strong={strong}
          style={style}
        >
          {children}
        </Typography.Paragraph>
      )
    default:
      return (
        <Typography.Text
          italic={italic}
          underline={italic}
          strong={strong}
          style={style}
        >
          {children}
        </Typography.Text>
      )
  }
}
