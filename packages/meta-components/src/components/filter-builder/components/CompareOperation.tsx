import React, { FC, Fragment, useCallback, useContext, useMemo } from 'react'
import update from 'immutability-helper'
import { Input, Space, Form } from 'antd'
import { CloseLine } from '@airclass/icons'
import { Button, Select } from '@toy-box/toybox-ui'
import { CompareOP, MetaValueType } from '@toy-box/meta-schema'
import get from 'lodash.get'
import { FilterValueInput } from './FilterValueInput'
import { FilterBuilderContext } from '../context'
import { IFieldService, OpTypeEnum } from '../interface'

const inputStyle = { width: '320px' }
const verticalStyle = { width: '100%' }

export type CompareOperationProps = {
  index: number
  fieldMetas:
    | Toybox.MetaSchema.Types.IFieldMeta[]
    | Toybox.MetaSchema.Types.IFieldGroupMeta[]
  compare: Partial<Toybox.MetaSchema.Types.ICompareOperation>
  filterFieldService?: IFieldService
  localeData: any
  layout?: 'horizontal' | 'vertical'
}

const numberOps = [
  CompareOP.EQ,
  CompareOP.NE,
  CompareOP.GT,
  CompareOP.LT,
  CompareOP.GTE,
  CompareOP.LTE,
  CompareOP.IS_NULL,
]

const dateOps = [
  CompareOP.UNIT_DATE_RANGE,
  CompareOP.BETWEEN,
  CompareOP.EQ,
  CompareOP.NE,
  CompareOP.GT,
  CompareOP.LT,
  CompareOP.GTE,
  CompareOP.LTE,
  CompareOP.IS_NULL,
]

const stringOps = [
  CompareOP.EQ,
  CompareOP.NE,
  CompareOP.IN,
  CompareOP.NIN,
  CompareOP.GT,
  CompareOP.LT,
  CompareOP.GTE,
  CompareOP.LTE,
  CompareOP.LIKE,
  CompareOP.IS_NULL,
]

const optionOps = [
  CompareOP.EQ,
  CompareOP.NE,
  CompareOP.IN,
  CompareOP.NIN,
  CompareOP.IS_NULL,
]

const booleanOps = [CompareOP.EQ, CompareOP.NE, CompareOP.IS_NULL]

const FieldOpMap: Record<string, Array<Toybox.MetaSchema.Types.CompareOP>> = {
  [MetaValueType.INTEGER]: numberOps,
  [MetaValueType.NUMBER]: numberOps,
  [MetaValueType.STRING]: stringOps,
  [MetaValueType.TEXT]: stringOps,
  [MetaValueType.BOOLEAN]: booleanOps,
  [MetaValueType.DATE]: dateOps,
  [MetaValueType.DATETIME]: dateOps,
  [MetaValueType.TIMESTAMP]: dateOps,
  [MetaValueType.SINGLE_OPTION]: optionOps,
  [MetaValueType.OBJECT_ID]: optionOps,
  [MetaValueType.OBJECT]: optionOps,
  [MetaValueType.ARRAY]: optionOps,
}

export const CompareOperation: FC<CompareOperationProps> = ({
  index,
  fieldMetas = [],
  compare,
  localeData,
  filterFieldService,
  layout = 'horizontal',
}) => {
  const context = useContext(FilterBuilderContext)
  const selected = useMemo(
    () => context.value.map((v) => v.source),
    [context.value]
  )

  const fieldOptions = useMemo(() => {
    return fieldMetas.map((field) => {
      if (field.children) {
        const children = field.children.map((child) => ({
          label: child.name,
          value: child.key,
          disabled:
            context.simple &&
            child.key !== compare.source &&
            selected.includes(child.key),
        }))
        return {
          label: field.label,
          value: field.value,
          children,
        }
      } else {
        return {
          label: field.name,
          value: field.key,
          disabled:
            context.simple &&
            field.key !== compare.source &&
            selected.includes(field.key),
        }
      }
    })
  }, [fieldMetas])

  const filterFieldMeta = useMemo(() => {
    let fieldMeta: any = {}
    fieldMetas.some((meta) => {
      if (meta.children) {
        fieldMeta = meta.children.find((f) => f.key === compare.source)
        return fieldMeta
      } else if (meta.key === compare.source) {
        fieldMeta = meta
        return fieldMeta
      }
    })
    return fieldMeta
  }, [fieldMetas, compare.source])

  const filterOperations = useMemo(() => {
    if (context.simple) {
      return compareOperationData([CompareOP.EQ])
    }
    if (filterFieldMeta?.type) {
      return compareOperationData(
        FieldOpMap[filterFieldMeta.type] || [CompareOP.EQ]
      )
    }
    return []
  }, [filterFieldMeta, context.simple])

  function compareOperationData(
    compareOperation: Toybox.MetaSchema.Types.CompareOP[]
  ) {
    let compareOperations = compareOperation.map((op) => {
      return {
        label: get(localeData.lang, `compareOperation.${op}`),
        value: op,
      }
    })
    const options = filterFieldMeta.operatOptions
    if (
      context?.operatType === OpTypeEnum.INSERT &&
      filterFieldMeta.operatOptions &&
      options
    ) {
      compareOperations.push(...options)
    } else if (
      context?.operatType === OpTypeEnum.REPLACE &&
      filterFieldMeta.operatOptions &&
      options
    ) {
      compareOperations = options
    }
    return compareOperations
  }

  const multiple = useMemo(
    () =>
      compare.op &&
      [CompareOP.IN, CompareOP.NIN, CompareOP.BETWEEN].includes(compare.op),
    [compare.op]
  )

  const onKeyChange = useCallback(
    (source: string) => {
      let fieldMeta: any = {}
      fieldMetas.forEach((meta) => {
        if (meta.children) {
          fieldMeta = meta.children.find((f) => f.key === compare.source)
        } else if (meta.key === source) {
          fieldMeta = meta
        }
      })
      const op =
        fieldMeta?.type &&
        FieldOpMap[fieldMeta.type].some((op) => op === compare.op)
          ? compare.op
          : FieldOpMap[fieldMeta?.type as any]?.[0]
      const type = context?.specialOptions?.some(
        (op) => op.value === compare.type
      )
        ? compare.type
        : context?.specialOptions?.[0].value
      const obj = {
        source: { $set: source },
        op: { $set: op },
        target: { $set: undefined },
      }
      if (context.specialMode) obj['type'] = { $set: type }
      const newCompare = update(compare, obj)
      context.onChange(update(context.value, { [index]: { $set: newCompare } }))
    },
    [context, compare, filterFieldMeta, index]
  )

  const onOperationChange = useCallback(
    (op: Toybox.MetaSchema.Types.CompareOP) => {
      if (
        compare.op === CompareOP.UNIT_DATE_RANGE ||
        compare.op === CompareOP.BETWEEN ||
        op === CompareOP.UNIT_DATE_RANGE ||
        op === CompareOP.BETWEEN
      ) {
        const newCompare = update(compare, {
          op: { $set: op },
          target: { $set: undefined },
        })
        context.onChange(
          update(context.value, { [index]: { $set: newCompare } })
        )
      } else if (op === CompareOP.IS_NULL) {
        const newCompare = update(compare, {
          op: { $set: op },
          target: { $set: false },
        })
        context.onChange(
          update(context.value, { [index]: { $set: newCompare } })
        )
      } else {
        const newCompare = update(compare, { op: { $set: op } })
        context.onChange(
          update(context.value, { [index]: { $set: newCompare } })
        )
      }
    },
    [compare, context, index]
  )

  const onValueChange = useCallback(
    (value: any) => {
      if (value === compare.target) return
      const newCompare = update(compare, { target: { $set: value } })
      context.onChange(update(context.value, { [index]: { $set: newCompare } }))
    },
    [compare, context, index]
  )

  const onTypeChange = useCallback(
    (value: any) => {
      const newCompare = update(compare, {
        type: { $set: value },
        target: { $set: undefined },
      })
      context.onChange(update(context.value, { [index]: { $set: newCompare } }))
    },
    [compare, context, index]
  )

  const handleRemove = useCallback(
    () => context.onChange(update(context.value, { $splice: [[index, 1]] })),
    [context, index]
  )

  const filterValueInput = useMemo(() => {
    return filterFieldMeta ? (
      <FilterValueInput
        key={compare.source}
        value={compare.target}
        multiple={multiple}
        fieldMeta={filterFieldMeta}
        fieldMetaService={filterFieldService}
        onChange={onValueChange}
        operation={compare.op}
        style={layout === 'vertical' ? verticalStyle : inputStyle}
        type={compare.type}
        customValueElement={context.customValueElement}
      />
    ) : (
      <Input
        disabled
        placeholder={get(localeData.lang, 'filed.placeholderOp.value')}
        style={layout === 'vertical' ? verticalStyle : inputStyle}
      />
    )
  }, [layout, filterFieldMeta, multiple, compare, onValueChange])

  const verticalRender = useMemo(
    () => (
      <div className="tbox-filter-compare__item-wrapper">
        <Form.Item>
          <Select
            style={{ width: '100%' }}
            value={compare.source}
            options={fieldOptions}
            placeholder={get(localeData.lang, 'filed.placeholderOp.select')}
            onChange={onKeyChange}
          />
        </Form.Item>
        <Form.Item>
          <Select
            style={{ width: '100%' }}
            value={compare.op}
            placeholder="运算符"
            options={filterOperations}
            onChange={onOperationChange}
            showArrow={false}
          />
        </Form.Item>
        {context.specialMode && (
          <Form.Item>
            <Select
              style={{ width: '100%' }}
              value={compare.type}
              placeholder="类型"
              options={filterFieldMeta ? context.specialOptions : []}
              onChange={onTypeChange}
              showArrow={false}
            />
          </Form.Item>
        )}
        <Form.Item>{filterValueInput}</Form.Item>
        <div style={{ textAlign: 'right' }}>
          <Button type="text" onClick={handleRemove} icon={<CloseLine />} />
        </div>
      </div>
    ),
    [
      compare,
      handleRemove,
      onTypeChange,
      onKeyChange,
      onOperationChange,
      fieldOptions,
      filterOperations,
      filterFieldMeta,
      context,
    ]
  )

  const horizontalRender = useMemo(
    () => (
      <Space>
        <Select
          style={{ width: '154px' }}
          value={compare.source}
          options={fieldOptions}
          placeholder={get(localeData.lang, 'filed.placeholderOp.select')}
          onChange={onKeyChange}
        />
        <Select
          style={{ width: '92px' }}
          value={compare.op}
          placeholder="运算符"
          options={filterOperations}
          onChange={onOperationChange}
          showArrow={false}
        />
        {context.specialMode && (
          <Select
            style={{ width: '108px' }}
            value={compare.type}
            placeholder="类型"
            options={filterFieldMeta ? context.specialOptions : []}
            onChange={onTypeChange}
            showArrow={false}
          />
        )}
        {filterValueInput}
        <Button
          type="text"
          onClick={handleRemove}
          icon={<CloseLine />}
        ></Button>
      </Space>
    ),
    [
      compare,
      handleRemove,
      onTypeChange,
      onKeyChange,
      onOperationChange,
      fieldOptions,
      filterOperations,
      filterFieldMeta,
      context,
    ]
  )

  return (
    <div className="tbox-filter-compare">
      {layout === 'vertical' ? verticalRender : horizontalRender}
    </div>
  )
}
