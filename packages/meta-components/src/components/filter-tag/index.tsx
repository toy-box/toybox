import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Tag, TagProps, Tooltip } from 'antd'
import get from 'lodash.get'
import { CompareOP } from '@toy-box/meta-schema'
import { useLocale } from '@toy-box/toybox-shared'
import localeMap from './locale'
import { LabelValueType } from '../filter-search'

export declare type BasicValueType = string | number | Date

export declare type RangeValueType = [number | Date, number | Date]

export interface IFilterData {
  title: string
  key: string
  op: CompareOP
  value: BasicValueType | BasicValueType[] | RangeValueType
  labelValue?: LabelValueType
}

export interface IFilterTagProps extends TagProps {
  filter: IFilterData
  ellipsis?: boolean
  remote?: (value: BasicValueType[]) => Promise<(string | number)[]>
  remove?: () => void
}

export const FilterTag: FC<IFilterTagProps> = ({
  filter,
  ellipsis,
  style,
  className,
  remote,
  remove,
  ...tagProps
}) => {
  const { title, op } = filter
  const locale = useLocale()
  const localeData = useMemo(() => localeMap[locale], [locale])
  const [labelValues, setLabelValues] = useState<(string | number | boolean)[]>(
    []
  )

  const handleRemove = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault()
      remove && remove()
    },
    [remove]
  )

  useEffect(() => {
    if (remote) {
      remote(Array.isArray(filter.value) ? filter.value : [filter.value]).then(
        (data) => {
          setLabelValues(data)
        }
      )
    } else {
      setLabelValues(
        Array.isArray(filter.labelValue)
          ? filter.labelValue.map((lv) => lv.label)
          : filter.labelValue
          ? [filter.labelValue.label]
          : []
      )
    }
  }, [remote, filter.labelValue])

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

  const text = useMemo(() => {
    if (op === CompareOP.IS_NULL) {
      return `${title} ${op ? '' : '不'} ${get(
        localeData.lang,
        `compareOperation.${op}`
      )}`
    }
    return `${title} ${get(localeData.lang, `compareOperation.${op}`)} ${
      labelValues && labelValues.join(',')
    }`
  }, [title, op, labelValues])

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
        className={className}
        closable={remove != null}
        onClose={handleRemove}
        {...tagProps}
      >
        {content}
      </Tag>
    </Tooltip>
  ) : (
    <Tag
      className={className}
      closable={remove != null}
      onClose={handleRemove}
      {...tagProps}
    >
      {content}
    </Tag>
  )
}
