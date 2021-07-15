import React from 'react'
import { connect, mapProps } from '@formily/react'
import {
  FieldBoolean as MetaFieldBoolean,
  FieldBooleanProps,
  FieldModeType,
} from '@toy-box/meta-components'

type ComposedInput = React.FC<FieldBooleanProps>

export const FieldBoolean: ComposedInput = connect(
  MetaFieldBoolean,
  mapProps((props, field) => {
    return {
      ...props,
      mode: field.readPretty ? 'read' : ('edit' as FieldModeType),
    }
  })
)

export default FieldBoolean
