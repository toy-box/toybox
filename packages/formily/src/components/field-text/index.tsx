import React from 'react'
import { connect, mapProps } from '@formily/react'
import {
  FieldText as MetaFieldText,
  FieldTextProps,
  FieldModeType,
} from '@toy-box/meta-components'
import { convertFormilyField2IFieldMeta } from '../../schema/convert'

type ComposedInput = React.FC<FieldTextProps>

export const FieldText: ComposedInput = connect(
  MetaFieldText,
  mapProps((props, field) => {
    return {
      ...props,
      mode: field.readPretty ? 'read' : ('edit' as FieldModeType),
      field: convertFormilyField2IFieldMeta(field, 'text'),
    }
  })
)

export default FieldText
