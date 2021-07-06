import React, { CSSProperties, FC } from 'react'

import '../styles/primaryColumn.less'
export interface PrimaryColumnProps {
  style?: CSSProperties
  className?: string
  objectMeta: Toybox.MetaSchema.Types.IObjectMeta
  onClick?: (text: any, record: Record<string, any>, index: number) => void
  text?: any
  record: Record<string, any>
  index: number
}

export const PrimaryColumn: FC<PrimaryColumnProps> = ({
  objectMeta,
  onClick,
  text,
  record,
  index,
}) => {
  return (
    <span
      className="tbox-primary-column"
      onClick={() => onClick && onClick(text, record, index)}
    >
      {record[objectMeta.titleKey || objectMeta.primaryKey || 'id'] || text}
    </span>
  )
}
