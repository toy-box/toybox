import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { IColumnProps } from '../interface'

declare type JSXComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>

export const connect = <T extends JSXComponent>(target: T) => {
  const Destination = React.forwardRef((props: IColumnProps, ref) => {
    const {
      fixed,
      align,
      component,
      width,
      sorter,
      sortDirections,
      visiable,
      ...field
    } = props.columnMeta
    return React.createElement(target, {
      field,
      value: props.text,
      mode: 'read',
      ref,
    })
  })
  if (target) hoistNonReactStatics(Destination, target as any)
  return Destination
}
