import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  CSSProperties,
  useContext,
} from 'react'
import { SelectValue } from 'antd/lib/select'
import { RawValueType } from 'rc-tree-select/lib/interface'
import dayjs, { Dayjs } from 'dayjs'
import get from 'lodash.get'
import { useLocale } from '@toy-box/toybox-shared'
import { CompareOP, CompareType, MetaValueType } from '@toy-box/meta-schema'
import { DatePicker, Search } from '@toy-box/toybox-ui'
import { DateUnitRange } from '../../date-unit-range'
import { localeMap } from '../locale'
import {
  FieldSelect,
  FieldString,
  FieldDate,
  FieldPercent,
  FieldNumber,
  FieldBoolean,
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
    (value: SelectValue, options: OptionItem | OptionItem[]) => {
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
        onChange(value[0])
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
    async (parentId) => {
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
    if (operation === CompareOP.IS_NULL) {
      return (
        <FieldBoolean
          field={{ type: 'boolean', key: 'target', name: 'target' }}
          value={value}
          onChange={(checked) => handleValue(checked)}
        />
      )
    } else if (type === CompareType.INPUT) {
      // const option = context?.specialOptions?.find((op) => op.value === 'formula');
      // const metaSchema = option?.config || [];
      // return (
      //   <FormulaModel
      //     value={value}
      //     onChange={handleValue}
      //     metaSchema={metaSchema}
      //     inputStyle={style}
      //   />
      // )
      return (
        <FieldString
          disabled={fieldMeta == null}
          field={fieldMeta}
          mode={mode}
          style={style}
          placeholder={`${get(localeData.lang, 'filed.placeholderOp.param')}${
            fieldMeta.name
          }`}
          value={value}
          allowClear
          onChange={handleValue}
          onPressEnter={onSubmit}
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
              fieldMeta.name
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
              fieldMeta.name
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
              fieldMeta.name
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
              )}${fieldMeta.name}`}
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
              fieldMeta.name
            }`}
            allowClear
            style={style}
            showSearch
            value={filterValue}
            onChange={(value, options) =>
              handleSelectOptions(value, options as OptionItem)
            }
            // onClear={() => onSubmit && onSubmit()}
          />
        )
      case MetaValueType.OBJECT:
        return (
          <FieldSelect
            placeholder={get(localeData.lang, 'filed.placeholderOp.value')}
            style={style}
            options={fieldMeta.options}
            field={fieldMeta}
            value={filterValue}
            showSearch
            remote={searchOptions}
            remoteByValue={searchByValue}
            onChange={(value, options) =>
              handleSelectOptions(value, options as OptionItem)
            }
            // onClear={() => onSubmit && onSubmit()}
          />
        )
      case MetaValueType.OBJECT_ID:
        // TODO: 需要判断何时用
        // if (
        //   fieldMeta.parentKey != null &&
        //   fieldMeta.parentKey !== '' &&
        //   multiple
        // ) {
        //   return (
        //     <FieldTreeSelect
        //       field={fieldMeta}
        //       style={style}
        //       mode={mode}
        //       placeholder={get(localeData.lang, 'filed.placeholderOp.value')}
        //       multiple={multiple}
        //       value={value}
        //       onChange={handleValue}
        //       loadData={findDataTrees}
        //       loadByValue={searchByValue}
        //     />
        //   )
        // }
        return (
          <FieldSelect
            placeholder={get(localeData.lang, 'filed.placeholderOp.value')}
            style={style}
            field={fieldMeta}
            value={filterValue}
            showSearch
            remote={searchOptions}
            remoteByValue={searchByValue}
            onChange={(value, options) =>
              handleSelectOptions(value, options as OptionItem)
            }
            // onClear={() => onSubmit && onSubmit()}
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
              fieldMeta.name
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
