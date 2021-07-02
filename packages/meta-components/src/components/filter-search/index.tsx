import React, { FC, useState, useMemo, useCallback } from 'react'
import { Space, Tooltip, Popover, Button } from 'antd'
import { Filter3Line } from '@airclass/icons'
import update from 'immutability-helper'
import { useLocale } from '@toy-box/toybox-shared'
import { CompareOP, MetaValueType } from '@toy-box/meta-schema'
import { FilterValueInput } from '../filter-builder/components/FilterValueInput'
import { FilterDesigner } from './components'
import localeMap from './locale'
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

export interface IFilterSearchProps {
  fieldMetas?: Toybox.MetaSchema.Types.IFieldMeta[]
  simpleFilterKeys?: string[]
  value?: FilterType
  filterFieldService?: IFieldService
  title?: string
  onChange?: (filter?: FilterType) => void
  onCancel?: () => void
  simple?: boolean
  onSubmit?: (value?: any) => void
}

export const FilterSearch: FC<IFilterSearchProps> = ({
  fieldMetas = [],
  simpleFilterKeys = [],
  filterFieldService,
  value = [],
  title,
  simple,
  onChange,
  onCancel,
  onSubmit,
}) => {
  const [filterEditVisible, setFilterEditVisible] = useState(false)
  const locale = useLocale()
  const localeData = useMemo(() => localeMap[locale], [locale])

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
      console.log('value', value)
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

  const onSimpleValueChange = (
    val: any,
    fieldMeta: Toybox.MetaSchema.Types.IFieldMeta
  ) => {
    handleValueChange(
      val,
      fieldMeta,
      [MetaValueType.STRING, MetaValueType.TEXT].some(
        (type) => type === fieldMeta.type
      )
        ? CompareOP.LIKE
        : CompareOP.EQ
    )
  }

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
      if (val == null) {
        return (
          onChange &&
          onChange(
            (value || []).filter((field) => field.source !== fieldMeta.key)
          )
        )
      }
      const refFilters = (value || []).filter(
        (field) => field.source === fieldMeta.key
      ).length
      let newValue = value
      if (refFilters === 0) {
        newValue = update(value || [], { $push: [fieldItem] })
      } else if (refFilters === 1) {
        const idx = (value || []).findIndex(
          (field) => field.source === fieldMeta.key
        )
        newValue = update(value || [], { [idx]: { $set: fieldItem } })
      } else if (refFilters > 1) {
        const unSelectValues = (value || []).filter(
          (field) => field.source !== fieldMeta.key
        )
        newValue = update(unSelectValues, { $push: [fieldItem] })
      }
      onChange && onChange(newValue)
    },
    [value, onChange]
  )

  const cencel = useCallback(() => {
    setFilterEditVisible(false)
  }, [setFilterEditVisible])

  // 子组件
  const filterContainer = useMemo(() => {
    return (
      <FilterDesigner
        fieldMetas={fieldMetas}
        value={value}
        title={title || localeData.lang.filter['defaultTitle']}
        filterFieldService={filterFieldService}
        onChange={handleChange}
        onCancel={cencel}
        simple={simple}
      />
    )
  }, [fieldMetas, value, filterFieldService])

  return (
    <div className="filter-model">
      <Space>
        <Popover
          placement="bottom"
          content={filterContainer}
          trigger="click"
          visible={filterEditVisible}
          onVisibleChange={setFilterEditVisible}
          destroyTooltipOnHide={false}
        >
          <Tooltip placement="top" title={localeData.lang.filter['tip']}>
            <Button icon={<Filter3Line />} />
          </Tooltip>
        </Popover>
        {simpleFilterKeys.map((key, idx) => {
          const fieldMeta = fieldMetas.find((field) => field.key === key)
          return fieldMeta ? (
            <FilterValueInput
              key={idx}
              value={filterValue(fieldMeta)}
              fieldMetaService={filterFieldService}
              multiple={false}
              fieldMeta={fieldMeta}
              onChange={(value) => onSimpleValueChange(value, fieldMeta)}
              onSubmit={handleSubmit}
              style={{ width: '160px' }}
            />
          ) : undefined
        })}
      </Space>
    </div>
  )
}
