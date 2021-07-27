import React from 'react'
import { connect, mapProps } from '@formily/react'
import { FieldModeType } from '@toy-box/meta-components'
import { pick } from 'lodash'

export const wrapperForFormily = (target) => {
  return connect(
    target,
    mapProps((props, field) => {
      return {
        ...props,
        mode: field.readPretty ? 'read' : ('edit' as FieldModeType),
      }
    })
  )
}

export const wrapperForDesignable = (target) => {
  return connect(
    target,
    mapProps((props, field) => {
      return {
        ...props,
        mode: field.readPretty ? 'read' : ('edit' as FieldModeType),
      }
    })
  )
  const Destination = React.forwardRef(
    (props: React.ComponentProps<any>, ref) => {
      const field = pick(props, [
        'key',
        'name',
        'type',
        'description',
        'primary',
        'options',
        'refObjectId',
        'unique',
        'required',
        'maximum',
        'minimum',
        'exclusiveMaximum',
        'exclusiveMinimum',
        'maxLength',
        'minLength',
        'precision',
        'multipleOf',
        'minProperties',
        'maxProperties',
        'maxItems',
        'minItems',
        'uniqueItems',
        'pattern',
        'format',
        'titleKey',
        'primaryKey',
        'parentKey',
        'properties',
        'items',
        'index',
        'defaultValue',
      ])
      return React.createElement(target, { ...props, field, ref })
    }
  )
  return Destination
}
