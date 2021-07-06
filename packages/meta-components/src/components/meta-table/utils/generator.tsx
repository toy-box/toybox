import React, { CSSProperties, FC } from 'react'
import { PrimaryColumn, PrimaryColumnProps } from '../components'

export interface PrimaryGeneratorOption {
  objectMeta: Toybox.MetaSchema.Types.IObjectMeta
  style?: CSSProperties
  className?: string
  onClick?: (text: any, record: Record<string, any>, index: number) => void
}

export const primaryGenerator = (
  option: PrimaryGeneratorOption,
  Component: FC<PrimaryColumnProps> = PrimaryColumn
) => {
  return ({ text, record, index }: PrimaryColumnProps) => {
    return <Component text={text} record={record} index={index} {...option} />
  }
}
