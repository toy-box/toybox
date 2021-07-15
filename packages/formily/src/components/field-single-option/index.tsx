import React from 'react'
import { connect, mapProps } from '@formily/react'
import {
  FieldSelect as MetaFieldSelect,
  FieldSelectProps,
  FieldModeType,
} from '@toy-box/meta-components'
import { convertFormilyField2IFieldMeta } from '../../schema/convert'

type ComposedInput = React.FC<FieldSelectProps>

export const FieldSingleOption: ComposedInput = connect(
  MetaFieldSelect,
  mapProps((props, field) => {
    return {
      ...props,
      mode: field.readPretty ? 'read' : ('edit' as FieldModeType),
    }
  })
)

export default FieldSingleOption
