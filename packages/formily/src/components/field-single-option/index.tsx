import React from 'react'
import { connect, mapProps } from '@formily/react'
import {
  FieldSelect as MetaFieldSelect,
  FieldSelectProps,
} from '@toy-box/meta-components'
import { convertFormilyField2IFieldMeta } from '../../schema/convert'

type ComposedInput = React.FC<FieldSelectProps>

export const FieldSingleOption: ComposedInput = connect(
  MetaFieldSelect,
  mapProps((props, field) => {
    return {
      ...props,
      field: convertFormilyField2IFieldMeta(field, 'singleOption'),
    }
  })
)

export default FieldSingleOption
