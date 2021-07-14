import React from 'react'
import { connect, mapProps } from '@formily/react'
import {
  FieldPercent as MetaFieldPercent,
  FieldPercentProps,
  FieldModeType,
} from '@toy-box/meta-components'
import { convertFormilyField2IFieldMeta } from '../../schema/convert'

type ComposedInput = React.FC<FieldPercentProps>

export const FieldPercent: ComposedInput = connect(
  MetaFieldPercent,
  mapProps((props, field) => {
    return {
      ...props,
      mode: field.readPretty ? 'read' : ('edit' as FieldModeType),
      field: convertFormilyField2IFieldMeta(field, props, 'percent'),
    }
  })
)

export default FieldPercent
