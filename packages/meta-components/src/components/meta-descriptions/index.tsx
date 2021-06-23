import React, { FC, useMemo } from 'react'
import { Descriptions } from 'antd'
import { DescriptionsProps } from 'antd/lib/descriptions'
import { FieldItem, FieldMap } from './components/FieldItem'
import {
  FieldModeType,
  FieldString,
  FieldText,
  FieldNumber,
  FieldDate,
  FieldSelect,
  FieldBoolean,
  FieldBusinessObject,
} from '../meta-fields'

const defaultFieldMap: FieldMap = {
  string: FieldString,
  text: FieldText,
  integer: FieldNumber,
  number: FieldNumber,
  date: FieldDate,
  datetime: FieldDate,
  singleOption: FieldSelect,
  boolean: FieldBoolean,
  object: FieldBusinessObject,
}

export type ItemMeta = Toybox.MetaSchema.Types.IFieldMeta & {
  mode?: FieldModeType
}

export type MetaDescriptonsProps = DescriptionsProps & {
  fieldMetas: ItemMeta[]
  mode: FieldModeType
  data: Record<string, any>
  fieldMap?: FieldMap
  onFieldChange?: (key: string, value: any) => void
}

export const MetaDescriptons: FC<MetaDescriptonsProps> = ({
  fieldMetas,
  fieldMap,
  mode,
  data,
  onFieldChange,
  ...otherProps
}) => {
  const mergeFieldMap = useMemo(
    () => Object.assign({}, defaultFieldMap, fieldMap),
    [fieldMap]
  )
  const fields = useMemo(() => {
    return fieldMetas.map((field, idx) => (
      <Descriptions.Item key={idx} label={field.name}>
        <FieldItem
          mode={mode}
          field={field}
          value={data[field.key]}
          fieldMap={mergeFieldMap}
          onChange={(value) => onFieldChange && onFieldChange(field.key, value)}
        />
      </Descriptions.Item>
    ))
  }, [data, fieldMetas, mode, mergeFieldMap])

  return <Descriptions {...otherProps}>{fields}</Descriptions>
}
