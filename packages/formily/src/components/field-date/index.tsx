import React from 'react'
import { connect, mapProps } from '@formily/react'
import {
  FieldDate as MetaFieldDate,
  FieldDateProps,
} from '@toy-box/meta-components'
import { convertFormilyField2IFieldMeta } from '../../schema/convert'

type ComposedInput = React.FC<FieldDateProps>

export const FieldDate: ComposedInput = connect(
  MetaFieldDate,
  mapProps((props, field) => {
    return {
      ...props,
      field: convertFormilyField2IFieldMeta(field),
    }
  })
)

export default FieldDate
