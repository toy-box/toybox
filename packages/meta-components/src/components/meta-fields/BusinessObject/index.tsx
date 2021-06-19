import React, { Ref, ForwardRefRenderFunction, ReactNode } from 'react'
import { BaseFieldProps, CustomizeComponent } from '../interface'

export interface FieldBusinessObjectProps extends BaseFieldProps {
  value?: Record<string, any>
  titleKey?: string
  component?: CustomizeComponent
}

// TODO: edit 模式需要考虑
const BusinessObject: ForwardRefRenderFunction<any, FieldBusinessObjectProps> =
  (
    { value, titleKey = 'id', onClick, component: Component = 'span' },
    ref: Ref<any>
  ) => {
    return (
      <Component onClick={onClick}>{value ? value[titleKey] : null}</Component>
    )
  }

export const FieldBusinessObject = React.forwardRef(BusinessObject)
