import React from 'react'
import { connect, mapProps } from '@formily/react'
import {
  FieldSelect as MetaFieldSelect,
  FieldSelectProps,
} from '@toy-box/meta-components'
import { convertFormilyField2IFieldMeta } from '../../schema/convert'

type ComposedInput = React.FC<FieldSelectProps>

export const FieldObjectId: ComposedInput = connect(
  MetaFieldSelect,
  mapProps((props, field) => {
    return {
      ...props,
      field: convertFormilyField2IFieldMeta(field, 'objectId'),
    }
  })
)

export default FieldObjectId
