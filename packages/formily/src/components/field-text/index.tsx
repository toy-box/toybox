import React from 'react'
import { connect, mapProps } from '@formily/react'
import {
  FieldText as MetaFieldText,
  FieldTextProps,
  FieldModeType,
} from '@toy-box/meta-components'

type ComposedInput = React.FC<FieldTextProps>

export const FieldText: ComposedInput = connect(
  MetaFieldText,
  mapProps((props, field) => {
    return {
      ...props,
      mode: field.readPretty ? 'read' : ('edit' as FieldModeType),
    }
  })
)

export default FieldText
