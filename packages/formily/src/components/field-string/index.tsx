import React from 'react'
import { connect, mapProps } from '@formily/react'
import {
  FieldString as MetaFieldString,
  FieldStringProps,
  FieldModeType,
} from '@toy-box/meta-components'
import { LoadingOutlined } from '@ant-design/icons'

type ComposedInput = React.FC<FieldStringProps>

export const FieldString: ComposedInput = connect(
  MetaFieldString,
  mapProps((props, field) => {
    return {
      ...props,
      mode: field.readPretty ? 'read' : ('edit' as FieldModeType),
      suffix: (
        <span>
          {field?.['loading'] || field?.['validating'] ? (
            <LoadingOutlined />
          ) : (
            props.suffix
          )}
        </span>
      ),
    }
  })
)

export default FieldString
