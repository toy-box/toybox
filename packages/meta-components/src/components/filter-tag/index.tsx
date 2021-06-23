import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Tag, TagProps, Tooltip } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import get from 'lodash.get'
import { isArr } from '@toy-box/toybox-shared'
import {
  CompareOP,
  ICompareOperation,
  MetaValueType,
} from '@toy-box/meta-schema'
import { useLocale } from '@toy-box/toybox-shared'
import localeMap from './locale'
import dateUnitRangeLocaleMap from '../date-unit-range/locales'
import './styles'

export declare type BasicValueType = string | number | Date

export declare type RangeValueType = [number | Date, number | Date]

declare type RemoteFetchType = (
  value: BasicValueType[]
) => Promise<Toybox.MetaSchema.Types.IFieldOption[]>

const formatter = (filedMeta: Toybox.MetaSchema.Types.IFieldMeta) => {
  if (filedMeta.format) {
    return filedMeta.format
  }
  if (filedMeta.type === MetaValueType.DATE) {
    return 'LL'
  }
  if (filedMeta.type === MetaValueType.DATETIME) {
    return 'LL HH:mm'
  }
  return ''
}

const optionText = (
  fieldMeta: Toybox.MetaSchema.Types.IFieldMeta,
  value: string | string[]
) => {
  if (value == null) {
    return ['']
  }
  return (isArr(value) ? value : [value]).map(
    (optVal) =>
      (fieldMeta.options || []).find((opt) => opt.value === optVal)?.label ||
      optVal
  )
}

const setRemoteText = async (
  remote: RemoteFetchType,
  value: string | string[],
  callback: (value: string[]) => void
) => {
  const textValues = (await remote(isArr(value) ? value : [value])).map(
    (opt) => opt.label
  )
  callback(textValues)
}

export interface IFilterTagProps extends TagProps {
  compare: Toybox.MetaSchema.Types.ICompareOperation
  fieldMeta: Toybox.MetaSchema.Types.IFieldMeta
  ellipsis?: boolean
  remote?: RemoteFetchType
  remove?: () => void
}

export const FilterTag: FC<IFilterTagProps> = ({
  compare,
  fieldMeta,
  remote,
  remove,
  ellipsis,
  style,
  className,
  ...tagProps
}) => {
  const locale = useLocale()
  const localeData = useMemo(() => localeMap[locale], [locale])
  const unitRangeLocale = useMemo(
    () => dateUnitRangeLocaleMap[locale],
    [locale]
  )
  const [textValues, setTextValues] = useState<string[]>([])

  const dateText = useCallback(
    (
      fieldMeta: Toybox.MetaSchema.Types.IFieldMeta,
      compare: ICompareOperation
    ) => {
      if (
        compare.target == null ||
        ![MetaValueType.DATE, MetaValueType.DATETIME].includes(
          fieldMeta.type as MetaValueType
        )
      ) {
        return ['']
      }
      if (compare.op === CompareOP.UNIT_DATE_RANGE) {
        return [get(unitRangeLocale, `lang.${compare.target}`)]
      }
      return (isArr(compare.target) ? compare.target : [compare.target]).map(
        (dateStr) => dayjs(dateStr).format(formatter(fieldMeta))
      )
    },
    [unitRangeLocale]
  )

  const handleRemove = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault()
      remove && remove()
    },
    [remove]
  )

  const ellipsisStyle = useMemo(
    () =>
      ellipsis
        ? {
            whiteSpaces: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'inline-block',
            verticalAlign: 'bottom',
          }
        : {},
    [ellipsis]
  )

  const styleMixs = useMemo(
    () => ({
      ...style,
      ...ellipsisStyle,
    }),
    [ellipsisStyle, style]
  )

  useEffect(() => {
    const getValueText = async (
      fieldMeta: Toybox.MetaSchema.Types.IFieldMeta,
      compare: ICompareOperation
    ) => {
      switch (fieldMeta.type) {
        case MetaValueType.DATE:
        case MetaValueType.DATETIME:
          setTextValues(dateText(fieldMeta, compare))
          break
        case MetaValueType.SINGLE_OPTION:
        case MetaValueType.MULTI_OPTION:
          setTextValues(
            optionText(fieldMeta, compare.target as string | string[])
          )
          break
        case MetaValueType.OBJECT_ID:
        case MetaValueType.OBJECT:
          remote && setRemoteText(remote, compare.target, setTextValues)
          break
        case MetaValueType.PERCENT:
          return setTextValues(
            isArr(compare.target)
              ? compare.target.map((t) => `${t}%`)
              : [`${compare.target}%`]
          )
        default:
          return setTextValues(
            isArr(compare.target) ? compare.target : [compare.target]
          )
      }
    }
    getValueText(fieldMeta, compare)
  }, [fieldMeta, compare, remote])

  const text = useMemo(() => {
    if (compare.op === CompareOP.IS_NULL) {
      return `${fieldMeta.name} ${compare.op ? '' : '不'} ${get(
        localeData.lang,
        `compareOperation.${compare.op}`
      )}`
    }
    return `${fieldMeta.name} ${get(
      localeData.lang,
      `compareOperation.${compare.op}`
    )} ${textValues.join(', ')}`
  }, [compare, textValues, localeData])

  const content = useMemo(() => {
    return ellipsis ? (
      <span style={styleMixs}>{text}</span>
    ) : (
      <span style={styleMixs}>{text}</span>
    )
  }, [ellipsis, text])

  return ellipsis ? (
    <Tooltip title={text} placement="topLeft">
      <Tag
        className={classNames('tbox-filter-tag', className)}
        closable={remove != null}
        onClose={handleRemove}
        {...tagProps}
      >
        {content}
      </Tag>
    </Tooltip>
  ) : (
    <Tag
      className={classNames('tbox-filter-tag', className)}
      closable={remove != null}
      onClose={handleRemove}
      {...tagProps}
    >
      {content}
    </Tag>
  )
}
