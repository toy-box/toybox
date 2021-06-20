import React, { FC, useState, useMemo, useCallback } from 'react'
import { Form, Tooltip, Popover, Button } from 'antd'
import { Filter3Line } from '@airclass/icons'
import update from 'immutability-helper'
import { useLocale } from '@toy-box/toybox-shared'
import { CompareOP, MetaValueType } from '@toy-box/meta-schema'
import { FilterValueInput } from '../filter-builder/components/FilterValueInput'
import { FilterDesigner } from './components'
import localeMap from './locale'
import { FieldService } from '../filter-builder/interface'

export interface LabelValue {
  value: any
  label: string
}

export declare type LabelValueType = LabelValue | LabelValue[]

export declare type FilterType = Toybox.MetaSchema.Types.ICompareOperation[]

export interface FilterLabel {
  title: string
  key: string
  op: Toybox.MetaSchema.Types.CompareOP
  labelValue: LabelValueType
  ellipsis?: boolean
}

export interface IFilterSearchProps {
  filterFieldMetas: Toybox.MetaSchema.Types.IFieldMeta[]
  simpleFilterKeys?: string[]
  value?: FilterType
  filterFieldService?: FieldService
  title?: string
  onChange?: (filter?: FilterType) => void
  onCancel?: () => void
}

export const FilterSearch: FC<IFilterSearchProps> = ({
  filterFieldMetas,
  simpleFilterKeys = [],
  filterFieldService,
  value,
  title,
  onChange,
  onCancel,
}) => {
  const [filterEditVisible, setFilterEditVisible] = useState(false)
  const locale = useLocale()
  const localeData = useMemo(() => localeMap[locale], [locale])

  const handleChange = useCallback(
    (filter: FilterType) => {
      setFilterEditVisible(false)
      const validFilter = filter.filter(
        (item) => item.op && item.target != null
      )
      onChange && onChange(validFilter)
    },
    [onChange, setFilterEditVisible]
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

  const onValueChange = (
    val: any,
    filterField: Toybox.MetaSchema.Types.IFieldMeta
  ) => {
    switch (filterField.type) {
      case MetaValueType.STRING:
      case MetaValueType.SINGLE_OPTION:
      case MetaValueType.OBJECT_ID:
        handleValueChange(val, filterField, CompareOP.IN)
        break
      default:
        handleValueChange(val, filterField, CompareOP.EQ)
        break
    }
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
      if (refFilters === 0) {
        return onChange && onChange(update(value, { $push: [fieldItem] }))
      }
      if (refFilters === 1) {
        const idx = (value || []).findIndex(
          (field) => field.source === fieldMeta.key
        )
        return (
          onChange && onChange(update(value, { [idx]: { $set: fieldItem } }))
        )
      }
      if (refFilters > 1) {
        const unSelectValues = (value || []).filter(
          (field) => field.source !== fieldMeta.key
        )
        return (
          onChange && onChange(update(unSelectValues, { $push: [fieldItem] }))
        )
      }
    },
    [value, onChange]
  )

  const cencel = useCallback(() => {
    setFilterEditVisible(false)
  }, [])

  // 子组件
  const filterContainer = useMemo(() => {
    return (
      <FilterDesigner
        filterFieldMetas={filterFieldMetas}
        value={value}
        title={title || localeData.lang.filter['defaultTitle']}
        filterFieldService={filterFieldService}
        onChange={handleChange}
        onCancel={cencel}
      />
    )
  }, [filterFieldMetas, value, filterFieldService])

  return (
    <div className="filter-model">
      <Form layout="inline">
        <Form.Item>
          <Popover
            overlayClassName="no-padding"
            placement="bottom"
            content={filterContainer}
            trigger="click"
            visible={filterEditVisible}
            onVisibleChange={setFilterEditVisible}
            destroyTooltipOnHide={true}
          >
            <Tooltip placement="top" title={localeData.lang.filter['tip']}>
              <Button icon={<Filter3Line />} />
            </Tooltip>
          </Popover>
        </Form.Item>
        {simpleFilterKeys.map((key, idx) => {
          const fieldMeta = filterFieldMetas.find((field) => field.key === key)
          return fieldMeta ? (
            <Form.Item key={idx}>
              <FilterValueInput
                value={filterValue(fieldMeta)}
                fieldMetaService={filterFieldService}
                multiple={false}
                fieldMeta={fieldMeta}
                onChange={(value) => onValueChange(value, fieldMeta)}
                style={{ width: '160px' }}
              />
            </Form.Item>
          ) : undefined
        })}
      </Form>
    </div>
  )
}
