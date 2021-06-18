import React, { FC, useCallback, useContext, useMemo } from 'react'
import update from 'immutability-helper'
import { Button, Select, Input, Space } from 'antd'
import { CloseLine } from '@airclass/icons'
import get from 'lodash.get'
import { FilterValueInput } from './FilterValueInput'
import { FilterBuilderContext } from '../context'
import { FieldService } from '../interface'

const inputStyle = { width: '320px' }

export interface CompareOperationProps {
  index: number
  filterFieldMetas: Toybox.MetaSchema.Types.IFieldMeta[]
  compare: Partial<Toybox.MetaSchema.Types.ICompareOperation>
  filterFieldService?: FieldService
  localeData: any
}

const numberOps = [
  Toybox.MetaSchema.Types.CompareOP.EQ,
  Toybox.MetaSchema.Types.CompareOP.NE,
  Toybox.MetaSchema.Types.CompareOP.GT,
  Toybox.MetaSchema.Types.CompareOP.LT,
  Toybox.MetaSchema.Types.CompareOP.GTE,
  Toybox.MetaSchema.Types.CompareOP.LTE,
  Toybox.MetaSchema.Types.CompareOP.IS_NULL,
]

const dateOps = [
  Toybox.MetaSchema.Types.DateCompareOP.UNIT_DATE_RANGE,
  Toybox.MetaSchema.Types.DateCompareOP.BETWEEN,
  Toybox.MetaSchema.Types.CompareOP.EQ,
  Toybox.MetaSchema.Types.CompareOP.NE,
  Toybox.MetaSchema.Types.CompareOP.GT,
  Toybox.MetaSchema.Types.CompareOP.LT,
  Toybox.MetaSchema.Types.CompareOP.GTE,
  Toybox.MetaSchema.Types.CompareOP.LTE,
  Toybox.MetaSchema.Types.CompareOP.IS_NULL,
]

const stringOps = [
  Toybox.MetaSchema.Types.CompareOP.EQ,
  Toybox.MetaSchema.Types.CompareOP.NE,
  Toybox.MetaSchema.Types.CompareOP.IN,
  Toybox.MetaSchema.Types.CompareOP.NIN,
  Toybox.MetaSchema.Types.CompareOP.GT,
  Toybox.MetaSchema.Types.CompareOP.LT,
  Toybox.MetaSchema.Types.CompareOP.GTE,
  Toybox.MetaSchema.Types.CompareOP.LTE,
  Toybox.MetaSchema.Types.CompareOP.IS_NULL,
]

const optionOps = [
  Toybox.MetaSchema.Types.CompareOP.EQ,
  Toybox.MetaSchema.Types.CompareOP.NE,
  Toybox.MetaSchema.Types.CompareOP.IN,
  Toybox.MetaSchema.Types.CompareOP.NIN,
  Toybox.MetaSchema.Types.CompareOP.IS_NULL,
]

const booleanOps = [
  Toybox.MetaSchema.Types.CompareOP.EQ,
  Toybox.MetaSchema.Types.CompareOP.NE,
  Toybox.MetaSchema.Types.CompareOP.IS_NULL,
]

const FieldOpMap: Record<
  string,
  Array<Toybox.MetaSchema.Types.UniteCompareOP>
> = {
  [Toybox.MetaSchema.Types.MetaValueType.INTEGER]: numberOps,
  [Toybox.MetaSchema.Types.MetaValueType.NUMBER]: numberOps,
  [Toybox.MetaSchema.Types.MetaValueType.STRING]: stringOps,
  [Toybox.MetaSchema.Types.MetaValueType.TEXT]: stringOps,
  [Toybox.MetaSchema.Types.MetaValueType.BOOLEAN]: booleanOps,
  [Toybox.MetaSchema.Types.MetaValueType.DATE]: dateOps,
  [Toybox.MetaSchema.Types.MetaValueType.DATETIME]: dateOps,
  [Toybox.MetaSchema.Types.MetaValueType.SINGLE_OPTION]: optionOps,
  [Toybox.MetaSchema.Types.MetaValueType.OBJECT_ID]: optionOps,
}

export const CompareOperation: FC<CompareOperationProps> = ({
  index,
  filterFieldMetas,
  compare,
  localeData,
  filterFieldService,
}) => {
  const context = useContext(FilterBuilderContext)
  const fieldOptions = useMemo(() => {
    return filterFieldMetas.map((field) => ({
      label: field.name,
      value: field.key,
    }))
  }, [filterFieldMetas])

  const filterFieldMeta = useMemo(
    () => filterFieldMetas.find((f) => f.key === compare.source),
    [filterFieldMetas, compare.source]
  )

  const filterOperations = useMemo(() => {
    if (filterFieldMeta?.type) {
      return compareOperationData(
        FieldOpMap[filterFieldMeta.type] || [
          Toybox.MetaSchema.Types.CompareOP.EQ,
        ]
      )
    }
    return []
  }, [filterFieldMeta])

  function compareOperationData(
    compareOperation: Toybox.MetaSchema.Types.UniteCompareOP[]
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
      compare.op === Toybox.MetaSchema.Types.CompareOP.IN ||
      compare.op === Toybox.MetaSchema.Types.CompareOP.NIN ||
      compare.op === Toybox.MetaSchema.Types.DateCompareOP.BETWEEN,
    [compare.op]
  )

  const onKeyChange = useCallback(
    (source: string) => {
      const fieldMeta = filterFieldMetas.find((meta) => meta.key === source)
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
    (op: Toybox.MetaSchema.Types.UniteCompareOP) => {
      if (
        compare.op === Toybox.MetaSchema.Types.DateCompareOP.UNIT_DATE_RANGE ||
        compare.op === Toybox.MetaSchema.Types.DateCompareOP.BETWEEN ||
        op === Toybox.MetaSchema.Types.DateCompareOP.UNIT_DATE_RANGE ||
        op === Toybox.MetaSchema.Types.DateCompareOP.BETWEEN
      ) {
        const newCompare = update(compare, {
          op: { $set: op },
          target: { $set: undefined },
        })
        context.onChange(
          update(context.value, { [index]: { $set: newCompare } })
        )
      } else if (op === Toybox.MetaSchema.Types.CompareOP.IS_NULL) {
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
