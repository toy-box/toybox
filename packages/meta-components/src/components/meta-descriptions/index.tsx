import React, { FC, useMemo } from 'react'
import { Descriptions } from 'antd'
import { DescriptionsProps } from 'antd/lib/descriptions'
import { IFieldMeta } from '@toy-box/meta-schema'
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

export type ItemMeta = IFieldMeta & {
  mode?: FieldModeType
}

export type MetaDescriptonsProps = DescriptionsProps & {
  fieldItemMetas: ItemMeta[]
  mode: FieldModeType
  data: Record<string, any>
  fieldMap?: FieldMap
}

export const MetaDescriptons: FC<MetaDescriptonsProps> = ({
  fieldItemMetas,
  fieldMap,
  mode,
  data,
  ...otherProps
}) => {
  const mergeFieldMap = useMemo(
    () => Object.assign({}, defaultFieldMap, fieldMap),
    [fieldMap]
  )
  const fields = useMemo(() => {
    return fieldItemMetas.map((field, idx) => (
      <Descriptions.Item key={idx} label={field.name}>
        <FieldItem
          mode={mode}
          field={field}
          value={data[field.key]}
          fieldMap={mergeFieldMap}
        />
      </Descriptions.Item>
    ))
  }, [data, fieldItemMetas, mode, mergeFieldMap])

  return <Descriptions {...otherProps}>{fields}</Descriptions>
}
