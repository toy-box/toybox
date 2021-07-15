import React from 'react'
import { connect, mapProps } from '@formily/react'
import {
  FieldNumber as MetaFieldNumber,
  FieldNumberProps,
  FieldModeType,
} from '@toy-box/meta-components'
import { convertFormilyField2IFieldMeta } from '../../schema/convert'

type ComposedInput = React.FC<FieldNumberProps>

export const FieldNumber: ComposedInput = connect(
  MetaFieldNumber,
  mapProps((props, field) => {
    return {
      ...props,
      mode: field.readPretty ? 'read' : ('edit' as FieldModeType),
    }
  })
)

export default FieldNumber
