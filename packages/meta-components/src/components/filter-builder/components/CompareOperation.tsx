import React, { FC, useCallback, useContext, useMemo } from 'react'
import update from 'immutability-helper'
import { Button, Select, Input, Space } from 'antd'
import { CloseLine } from '@airclass/icons'
import { CompareOP, MetaValueType } from '@toy-box/meta-schema'
import get from 'lodash.get'
import { FilterValueInput } from './FilterValueInput'
import { FilterBuilderContext } from '../context'
import { IFieldService } from '../interface'

const inputStyle = { width: '320px' }

export interface CompareOperationProps {
  index: number
  fieldMetas: Toybox.MetaSchema.Types.IFieldMeta[]
  compare: Partial<Toybox.MetaSchema.Types.ICompareOperation>
  filterFieldService?: IFieldService
  localeData: any
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
  [MetaValueType.SINGLE_OPTION]: optionOps,
  [MetaValueType.OBJECT_ID]: optionOps,
  [MetaValueType.OBJECT]: optionOps,
}

export const CompareOperation: FC<CompareOperationProps> = ({
  index,
  fieldMetas,
  compare,
  localeData,
  filterFieldService,
}) => {
  const context = useContext(FilterBuilderContext)
  const selected = useMemo(
    () => context.value.map((v) => v.source),
    [context.value]
  )

  const fieldOptions = useMemo(() => {
    return fieldMetas.map((field) => ({
      label: field.name,
      value: field.key,
      disabled:
        context.simple &&
        field.key !== compare.source &&
        selected.includes(field.key),
    }))
  }, [fieldMetas, compare.source, context.simple, selected])

  const filterFieldMeta = useMemo(
    () => fieldMetas.find((f) => f.key === compare.source),
    [fieldMetas, compare.source]
  )

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
    return compareOperation.map((op) => {
      return {
        label: get(localeData.lang, `compareOperation.${op}`),
        value: op,
      }
    })
  }

  const multiple = useMemo(
    () =>
      compare.op === CompareOP.IN ||
      compare.op === CompareOP.NIN ||
      compare.op === CompareOP.BETWEEN,
    [compare.op]
  )

  const onKeyChange = useCallback(
    (source: string) => {
      const fieldMeta = fieldMetas.find((meta) => meta.key === source)
      const op =
        fieldMeta && FieldOpMap[fieldMeta.type].some((op) => op === compare.op)
          ? compare.op
          : undefined
      const newCompare = update(compare, {
        source: { $set: source },
        op: { $set: op },
        target: { $set: undefined },
      })
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
        style={inputStyle}
      />
    ) : (
      <Input
        disabled
        placeholder={get(localeData.lang, 'filed.placeholderOp.value')}
        style={inputStyle}
      />
    )
  }, [filterFieldMeta, multiple, compare, onValueChange])

  return (
    <div className="tbox-filter-compare">
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
          options={filterOperations}
          onChange={onOperationChange}
          showArrow={false}
        />
        {filterValueInput}
        <Button
          type="text"
          onClick={handleRemove}
          icon={<CloseLine />}
        ></Button>
      </Space>
    </div>
  )
}
