import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  CSSProperties,
} from 'react'
import { SelectValue } from 'antd/lib/select'
import { RawValueType } from 'rc-tree-select/lib/interface'
import dayjs, { Dayjs } from 'dayjs'
import get from 'lodash.get'
import { useLocale } from '@toy-box/toybox-ui'
import { CompareOP, CompareType, MetaValueType } from '@toy-box/meta-schema'
import { DatePicker } from '@toy-box/toybox-ui'
import { DateUnitRange } from '../../date-unit-range'
import { localeMap } from '../locale'
import {
  FieldSelect,
  FieldString,
  FieldDate,
  FieldPercent,
  FieldNumber,
  FieldBoolean,
  FieldTimestamp,
  FieldTreeSelect,
} from '../../meta-fields'
import { IFieldService } from '../interface'

export declare type FilterValueInputType =
  | 'string'
  | 'number'
  | 'date'
  | 'datetime'
  | 'tree'
  | 'select'
  | 'unitDateRange'
  | 'dateBetween'

export interface FilterValueInputProps {
  fieldMeta: Toybox.MetaSchema.Types.IFieldMeta
  operation?: Toybox.MetaSchema.Types.CompareOP
  value?: any
  multiple?: boolean
  onChange: (value: any, text?: string[]) => void
  onSubmit?: () => void
  style?: CSSProperties
  mode?: 'read' | 'edit' | 'update'
  fieldMetaService?: IFieldService
  locale?: string
  type?: string
  index?: number
  CustomValueElement?: FC
  customValueProps?: any
}

declare type OptionItem = Toybox.MetaSchema.Types.IFieldOption

export const FilterValueInput: FC<FilterValueInputProps> = ({
  fieldMeta,
  operation,
  value,
  onChange,
  onSubmit,
  multiple,
  style,
  mode = 'edit',
  fieldMetaService,
  locale = 'zh_CN',
  type,
  index,
  CustomValueElement,
  customValueProps,
}) => {
  const innerLocale = useLocale()
  const localeData = useMemo(
    () => localeMap[locale || innerLocale],
    [locale, innerLocale]
  )
  const handleValue = useCallback(
    (value?: any, text?: string[]) => {
      onChange(value === undefined ? null : value, text)
      if (
        [
          MetaValueType.SINGLE_OPTION,
          MetaValueType.MULTI_OPTION,
          MetaValueType.DATE,
          MetaValueType.DATETIME,
          MetaValueType.OBJECT_ID,
          MetaValueType.BOOLEAN,
        ].includes(fieldMeta.type as MetaValueType)
      ) {
        onSubmit && onSubmit()
      } else if (
        fieldMeta.type === MetaValueType.STRING &&
        fieldMeta.format === 'date'
      ) {
        onSubmit && onSubmit()
      }
    },
    [onChange]
  )

  const handleSelectOptions = useCallback(
    (value: SelectValue, options?: OptionItem | OptionItem[]) => {
      if (Array.isArray(options)) {
        handleValue(value)
      } else {
        handleValue(value)
      }
    },
    [handleValue]
  )

  const handleTreeSelect = useCallback(
    (labelValue: RawValueType | RawValueType[]) => {
      handleValue(labelValue as RawValueType | RawValueType[])
    },
    [handleValue]
  )

  useEffect(() => {
    if (multiple) {
      if (value != null && !Array.isArray(value)) {
        onChange([value])
      } else if (value == null) {
        onChange(undefined)
      }
    } else {
      if (Array.isArray(value) && value.length > 0) {
        onChange(
          fieldMeta.type === MetaValueType.MULTI_OPTION ? value : value[0]
        )
      }
    }
  }, [multiple])

  const searchOptions = useCallback(
    async (value: any) => {
      if (fieldMeta == null || fieldMetaService?.findOptions == null) {
        return []
      }
      const ops = await fieldMetaService.findOptions(fieldMeta.key, value)
      return ops || ([] as OptionItem[])
    },
    [fieldMeta, fieldMetaService]
  )

  const searchByValue = useCallback(async () => {
    const ids = Array.isArray(value) ? value : [value]
    if (fieldMetaService?.findOfValues == null) {
      return []
    }
    const ops = await fieldMetaService.findOfValues(fieldMeta.key, ids)
    return ops || []
  }, [fieldMeta.key, fieldMetaService, value])

  const findDataTrees = useCallback(
    async (parentId: string | number) => {
      if (fieldMetaService?.findDataTrees == null) {
        return []
      }
      const ops = await fieldMetaService?.findDataTrees(fieldMeta.key, parentId)
      return ops || []
    },
    [fieldMeta.key, fieldMetaService]
  )

  const filterValue = useMemo(() => {
    if (multiple) {
      if (Array.isArray(value)) return value
      if (!Array.isArray(value) && value != null) return [value]
    } else {
      if (Array.isArray(value) && value.length > 0) return value[0]
      return value
    }
  }, [value, multiple])

  const input = useMemo(() => {
    if (CustomValueElement) {
      return (
        <CustomValueElement
          {...customValueProps}
          index={index}
        ></CustomValueElement>
      )
    } else if (operation === CompareOP.IS_NULL) {
      return (
        <FieldBoolean
          field={{ type: 'boolean', key: 'target', name: 'target' }}
          value={value}
          onChange={(checked) => handleValue(checked)}
        />
      )
    } else if (type === CompareType.REFERENCE) {
      return (
        <FieldSelect
          field={fieldMeta}
          disabled={fieldMeta == null}
          placeholder={`${get(
            localeData.lang,
            'filed.placeholderOp.variable'
          )}`}
          allowClear
          style={style}
          showSearch
          value={filterValue}
          onChange={(value, options) =>
            handleSelectOptions(value, options as OptionItem)
          }
        />
      )
    }
    switch (fieldMeta?.type) {
      case MetaValueType.STRING:
        return (
          <FieldString
            disabled={fieldMeta == null}
            field={fieldMeta}
            mode={mode}
            style={style}
            placeholder={`${get(localeData.lang, 'filed.placeholderOp.param')}${
              fieldMeta.name || ''
            }`}
            value={value}
            allowClear
            onChange={handleValue}
            onPressEnter={onSubmit}
            onClear={onSubmit}
          />
        )
      case MetaValueType.NUMBER:
      case MetaValueType.INTEGER:
        return (
          <FieldNumber
            disabled={fieldMeta == null}
            field={fieldMeta}
            placeholder={`${get(localeData.lang, 'filed.placeholderOp.param')}${
              fieldMeta.name || ''
            }`}
            style={style}
            value={value}
            onChange={handleValue}
            onPressEnter={onSubmit}
          />
        )
      case MetaValueType.PERCENT:
        return (
          <FieldPercent
            disabled={fieldMeta == null}
            field={fieldMeta}
            mode={'edit'}
            placeholder={`${get(localeData.lang, 'filed.placeholderOp.param')}${
              fieldMeta.name || ''
            }`}
            style={style}
            value={value}
            onChange={handleValue}
            onPressEnter={onSubmit}
          />
        )
      case MetaValueType.DATE:
      case MetaValueType.DATETIME:
        const format =
          fieldMeta.format || fieldMeta.type === MetaValueType.DATE
            ? 'YYYY/MM/DD'
            : 'YYYY/MM/DD HH:mm:ss'
        if (operation === CompareOP.UNIT_DATE_RANGE) {
          return (
            <DateUnitRange
              style={style}
              value={value}
              onChange={(value, text) => handleValue(value, text ? [text] : [])}
            />
          )
        }
        if (operation === CompareOP.BETWEEN) {
          const innerValue =
            value != null
              ? ([dayjs(value[0]), dayjs(value[1])] as [Dayjs, Dayjs])
              : undefined
          return (
            <DatePicker.RangePicker
              value={innerValue}
              format={format}
              onChange={(value) => {
                const doValue = value
                  ? [
                      value[0]
                        ? dayjs(value[0].format(format)).toISOString()
                        : undefined,
                      value[1]
                        ? dayjs(value[1].format(format)).toISOString()
                        : undefined,
                    ]
                  : []
                handleValue(doValue)
              }}
              style={style}
              showTime={
                fieldMeta.type === MetaValueType.DATETIME
                  ? { format: 'HH:mm' }
                  : false
              }
            />
          )
        }
        return (
          <div style={style}>
            <FieldDate
              value={value}
              mode={mode}
              field={fieldMeta}
              placeholder={`${get(
                localeData.lang,
                'filed.placeholderOp.paramSelect'
              )}${fieldMeta.name || ''}`}
              onChange={(value, dateString) =>
                handleValue(value, dateString ? [dateString] : undefined)
              }
            />
          </div>
        )
      case MetaValueType.TIMESTAMP:
        if (operation === CompareOP.UNIT_DATE_RANGE) {
          return (
            <DateUnitRange
              style={style}
              value={value}
              onChange={(value, text) => handleValue(value, text ? [text] : [])}
            />
          )
        }
        if (operation === CompareOP.BETWEEN) {
          const innerValue =
            value != null
              ? ([dayjs(value[0]), dayjs(value[1])] as [Dayjs, Dayjs])
              : undefined
          return (
            <DatePicker.RangePicker
              value={innerValue}
              onChange={(value) => {
                const doValue = value
                  ? [
                      value[0] ? dayjs(value[0]).unix() : undefined,
                      value[1] ? dayjs(value[1]).unix() : undefined,
                    ]
                  : []
                handleValue(doValue)
              }}
              style={style}
              showTime={{ format: 'HH:mm:ss' }}
            />
          )
        }
        return (
          <div style={style}>
            <FieldTimestamp
              value={value}
              mode={mode}
              field={fieldMeta}
              placeholder={`${get(
                localeData.lang,
                'filed.placeholderOp.paramSelect'
              )}${fieldMeta.name || ''}`}
              onChange={(value, dateString) =>
                handleValue(value, dateString ? [dateString] : undefined)
              }
            />
          </div>
        )
      case MetaValueType.SINGLE_OPTION:
        return (
          <FieldSelect
            field={fieldMeta}
            disabled={fieldMeta == null}
            placeholder={`${get(localeData.lang, 'filed.placeholderOp.param')}${
              fieldMeta.name || ''
            }`}
            allowClear
            style={style}
            selectMode={multiple ? 'multiple' : undefined}
            showSearch
            value={filterValue}
            onChange={(value, options) =>
              handleSelectOptions(value, options as OptionItem)
            }
          />
        )
      case MetaValueType.MULTI_OPTION:
        return (
          <FieldSelect
            field={fieldMeta}
            disabled={fieldMeta == null}
            placeholder={`${get(localeData.lang, 'filed.placeholderOp.param')}${
              fieldMeta.name || ''
            }`}
            allowClear
            style={style}
            selectMode="multiple"
            showSearch
            value={value}
            onChange={(value, options) =>
              handleSelectOptions(value, options as OptionItem)
            }
          />
        )
      case MetaValueType.OBJECT:
        return (
          <FieldSelect
            placeholder={get(localeData.lang, 'filed.placeholderOp.value')}
            style={style}
            options={fieldMeta.options}
            field={fieldMeta}
            selectMode={multiple ? 'multiple' : undefined}
            value={filterValue}
            showSearch
            remote={searchOptions}
            remoteByValue={searchByValue}
            onChange={(value, options) =>
              handleSelectOptions(value, options as OptionItem)
            }
          />
        )
      case MetaValueType.OBJECT_ID:
        return fieldMeta.parentKey && fieldMetaService?.findDataTrees ? (
          <FieldTreeSelect
            placeholder={`${get(localeData.lang, 'filed.placeholderOp.value')}${
              fieldMeta.name || ''
            }`}
            field={fieldMeta}
            style={style}
            multiple={multiple}
            value={filterValue}
            loadData={findDataTrees}
            onChange={handleSelectOptions}
            loadByValue={searchByValue}
          />
        ) : (
          <FieldSelect
            placeholder={`${get(localeData.lang, 'filed.placeholderOp.value')}${
              fieldMeta.name || ''
            }`}
            style={style}
            field={fieldMeta}
            selectMode={multiple ? 'multiple' : undefined}
            value={filterValue}
            showSearch
            remote={searchOptions}
            remoteByValue={searchByValue}
            onChange={(value, options) =>
              handleSelectOptions(value, options as OptionItem)
            }
          />
        )
      case MetaValueType.BOOLEAN:
        return (
          <FieldBoolean
            field={fieldMeta}
            value={value}
            onChange={(checked) => handleValue(checked)}
          />
        )
      default:
        return (
          <FieldString
            disabled={fieldMeta == null}
            field={fieldMeta}
            mode={mode}
            style={style}
            placeholder={`${get(localeData.lang, 'filed.placeholderOp.param')}${
              fieldMeta.name || ''
            }`}
            value={value}
            onChange={handleValue}
            onPressEnter={() => onSubmit && onSubmit()}
          />
        )
    }
  }, [
    fieldMeta,
    style,
    value,
    multiple,
    handleValue,
    handleSelectOptions,
    handleTreeSelect,
  ])

  return input
}

export default FilterValueInput
