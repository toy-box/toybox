import React, {
  FC,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import { Space } from 'antd'
import update from 'immutability-helper'
import { isStr } from '@toy-box/toybox-shared'
import { CompareOP } from '@toy-box/meta-schema'
import { FilterValueInput } from '../filter-builder/components/FilterValueInput'
import { FilterWidget } from './components'
import { IFieldService } from '../filter-builder/interface'

export interface ILabelValue {
  value: any
  label: string
}

export declare type LabelValueType = ILabelValue | ILabelValue[]

export declare type FilterType = Toybox.MetaSchema.Types.ICompareOperation[]

export interface FilterLabel {
  title: string
  key: string
  op: Toybox.MetaSchema.Types.CompareOP
  labelValue: LabelValueType
  ellipsis?: boolean
}

export interface ISimpleFilter {
  key: string
  op: CompareOP
}

export type SimpleFilterType = string | ISimpleFilter

export interface IFilterSearchProps {
  fieldMetas?: Toybox.MetaSchema.Types.IFieldMeta[]
  simpleFilterKeys?: SimpleFilterType[]
  value?: FilterType
  filterFieldService?: IFieldService
  title?: string
  onChange?: (filter?: FilterType) => void
  onCancel?: () => void
  onSubmit?: (value?: any) => void
  simple?: boolean
  hiddenDesigner?: boolean
}

export const FilterSearch: FC<IFilterSearchProps> = ({
  fieldMetas = [],
  simpleFilterKeys = [],
  filterFieldService,
  value = [],
  title,
  simple,
  hiddenDesigner,
  onChange,
  onCancel,
  onSubmit,
}) => {
  const [filterEditVisible, setFilterEditVisible] = useState(false)
  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  }, [value])

  const handleSubmit = useCallback(() => {
    onSubmit && onSubmit()
  }, [onSubmit])

  const handleChange = useCallback(
    (filter: FilterType) => {
      setFilterEditVisible(false)
      const validFilter = filter.filter(
        (item) => item.op && item.target != null
      )
      onChange && onChange(validFilter)
      handleSubmit()
    },
    [onChange, handleSubmit, setFilterEditVisible]
  )

  const filterValue = useCallback(
    (filed) => {
      const meta = value?.find((val) => val.source === filed.key)
      const metaArr = value?.filter((val) => val.source === filed.key)
      if (metaArr && metaArr.length > 1) return
      const isShowMeta =
        meta && (meta.op === CompareOP.IN || meta.op === CompareOP.EQ)
      if (
        meta &&
        isShowMeta &&
        (!Array.isArray(meta.target) || meta.target.length === 1)
      )
        return meta.target
      return
    },
    [value]
  )

  const handleValueChange = useCallback(
    (
      val,
      fieldMeta: Toybox.MetaSchema.Types.IFieldMeta,
      op: CompareOP = CompareOP.EQ
    ) => {
      const fieldItem: Toybox.MetaSchema.Types.ICompareOperation = {
        source: fieldMeta.key,
        op: op,
        target: val,
      }
      // 如果选项设置空则
      if (val == null || val === '') {
        return (
          onChange &&
          onChange(
            (valueRef.current || []).filter(
              (field) => field.source !== fieldMeta.key
            )
          )
        )
      }
      const refFilters = (valueRef.current || []).filter(
        (field) => field.source === fieldMeta.key
      ).length
      let newValue = valueRef.current
      if (refFilters === 0) {
        newValue = update(valueRef.current || [], { $push: [fieldItem] })
      } else if (refFilters === 1) {
        const idx = (valueRef.current || []).findIndex(
          (field) => field.source === fieldMeta.key
        )
        newValue = update(valueRef.current || [], {
          [idx]: { $set: fieldItem },
        })
      } else if (refFilters > 1) {
        const unSelectValues = (valueRef.current || []).filter(
          (field) => field.source !== fieldMeta.key
        )
        newValue = update(unSelectValues, { $push: [fieldItem] })
      }
      onChange && onChange(newValue)
    },
    [valueRef, onChange]
  )

  const cancel = useCallback(() => {
    setFilterEditVisible(false)
  }, [setFilterEditVisible])

  const simpleFilter = useMemo(() => {
    return simpleFilterKeys.map((simpleFilter, idx) => {
      const filterKey = isStr(simpleFilter) ? simpleFilter : simpleFilter.key
      const op = isStr(simpleFilter) ? CompareOP.EQ : simpleFilter.op
      const fieldMeta = fieldMetas.find((field) => field.key === filterKey)
      return fieldMeta ? (
        <FilterValueInput
          key={idx}
          value={filterValue(fieldMeta)}
          fieldMetaService={filterFieldService}
          multiple={false}
          fieldMeta={fieldMeta}
          onChange={(val) => handleValueChange(val, fieldMeta, op)}
          onSubmit={handleSubmit}
          style={{ width: '160px' }}
        />
      ) : undefined
    })
  }, [simpleFilterKeys, filterValue, handleValueChange])

  return (
    <div className="filter-model">
      <Space>
        {!hiddenDesigner && (
          <FilterWidget
            title={title}
            fieldMetas={fieldMetas}
            visible={filterEditVisible}
            onVisibleChange={setFilterEditVisible}
            value={valueRef.current}
            filterFieldService={filterFieldService}
            onChange={handleChange}
            onCancel={cancel}
            simple={simple}
          />
        )}
        {simpleFilter}
      </Space>
    </div>
  )
}
