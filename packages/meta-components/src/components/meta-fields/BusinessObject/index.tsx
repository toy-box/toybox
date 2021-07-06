import React, { Ref } from 'react'
import { BaseFieldProps, CustomizeComponent } from '../interface'

export interface FieldBusinessObjectProps extends BaseFieldProps {
  value?: Record<string, any>
  titleKey?: string
  component?: CustomizeComponent
}

// TODO: edit 模式需要考虑
export const FieldBusinessObject = React.forwardRef(
  (
    {
      value,
      field,
      onClick,
      component: Component = 'span',
    }: FieldBusinessObjectProps,
    ref: Ref<any>
  ) => {
    return (
      <Component onClick={() => onClick && onClick(value)}>
        {value ? value[field.titleKey || field.primaryKey || 'id'] : null}
      </Component>
    )
  }
)

FieldBusinessObject.displayName = 'FieldBusinessObject'
