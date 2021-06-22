import React, { FC, useMemo, useCallback } from 'react'
import dayjs from 'dayjs'
import get from 'lodash.get'
import { useLocale } from '@toy-box/toybox-shared'
import { MetaValueType, CompareOP } from '@toy-box/meta-schema'
import { FilterTag } from '../filter-tag'
import dateFilterLocales from '../date-unit-range/locales'

export interface IFilterMetaTag {
  fieldMeta: Toybox.MetaSchema.Types.IFieldMeta
  ellipsis?: boolean
  maxWidth?: number
  remote?: (
    key: string,
    value: (string | number)[]
  ) => Promise<(string | number)[]>
}

export interface IFilterTagsProps {
  filterFieldTags: IFilterMetaTag[]
  value?: Toybox.MetaSchema.Types.ICompareOperation[]
  remove?: (index: number) => void
}

export const FilterTags: FC<IFilterTagsProps> = ({
  filterFieldTags,
  value,
  remove,
}) => {
  const locale = useLocale()

  const ellipsis = useCallback(
    (tag) => {
      const meta = filterFieldTags?.find((val) => val.fieldMeta.key === tag.key)
      return (meta && meta.ellipsis) || true
    },
    [filterFieldTags]
  )

  const getMaxWidth = useCallback(
    (tag) => {
      const meta = filterFieldTags?.find((val) => val.fieldMeta.key === tag.key)
      return meta?.maxWidth ? `${meta.maxWidth}px` : '100px'
    },
    [filterFieldTags]
  )

  const remote = useCallback(
    (tag) => {
      const meta = filterFieldTags?.find((val) => val.fieldMeta.key === tag.key)
      return meta && meta.remote
    },
    [filterFieldTags]
  )

  const remoteMethod = useCallback(
    async (tag, value) => {
      const meta = filterFieldTags?.find((val) => val.fieldMeta.key === tag.key)
      if (meta && meta.remote) return meta.remote(tag.key, value)
      return value
    },
    [filterFieldTags]
  )

  const formatter = (
    type: MetaValueType.DATE | MetaValueType.DATETIME,
    format?: string
  ) => {
    return format || type === MetaValueType.DATE
      ? 'YYYY/MM/DD'
      : 'YYYY/MM/DD HH:mm'
  }

  const filterTags = useMemo(() => {
    let tags: any[] = []
    filterFieldTags.forEach((tag) => {
      const { fieldMeta } = tag
      const compares = value?.filter((val) => val.source === fieldMeta.key)
      if (compares) {
        compares.forEach((compare) => {
          if (
            fieldMeta.type === MetaValueType.DATE ||
            fieldMeta.type === MetaValueType.DATETIME
          ) {
            if (compare.op === CompareOP.BETWEEN) {
              tags.push({
                title: fieldMeta.name,
                key: compare.source,
                op: compare.op,
                value: [
                  dayjs((compare.target as string[])[0]).format(
                    formatter(fieldMeta.type, fieldMeta.format)
                  ),
                  dayjs((compare.target as string[])[1]).format(
                    formatter(fieldMeta.type, fieldMeta.format)
                  ),
                ],
              })
            } else if (compare.op === CompareOP.UNIT_DATE_RANGE) {
              tags.push({
                title: fieldMeta.name,
                key: compare.source,
                op: compare.op,
                value: get(dateFilterLocales[locale].lang, `${compare.target}`),
              })
            } else {
              tags.push({
                title: fieldMeta.name,
                key: compare.source,
                op: compare.op,
                value: dayjs(compare.target as string).format(
                  formatter(fieldMeta.type, fieldMeta.format)
                ),
              })
            }
          } else {
            tags.push({
              title: fieldMeta.name,
              key: compare.source,
              op: compare.op,
              value: compare.target,
              labelValue: [
                {
                  label: compare.target,
                  value: compare.target,
                },
              ],
            })
          }
        })
      }
    })
    return tags
  }, [filterFieldTags, value])

  return (
    <div className="filter-tags">
      {filterTags.map((tag, idx) => (
        <FilterTag
          key={idx}
          style={{ maxWidth: getMaxWidth(tag) }}
          remote={remote(tag) ? (value) => remoteMethod(tag, value) : undefined}
          filter={tag}
          remove={remove ? () => remove(idx) : undefined}
          ellipsis={ellipsis(tag)}
        />
      ))}
    </div>
  )
}
