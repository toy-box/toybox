import React, { FC, CSSProperties } from 'react'
import classNames from 'classnames'
import { FilterTag, IFilterTagProps } from '../filter-tag'
import { IFieldService } from '../filter-builder'

export interface IFilterTagsProps {
  fieldMetas?: Toybox.MetaSchema.Types.IFieldMeta[]
  dataSource?: Toybox.MetaSchema.Types.ICompareOperation[]
  remove?: (index: number) => void
  style?: CSSProperties
  className?: string
  tagOption?: Omit<
    IFilterTagProps,
    'compare' | 'fieldMeta' | 'remote' | 'remove'
  >
  fieldService?: IFieldService
}

export const FilterTags: FC<IFilterTagsProps> = ({
  fieldMetas = [],
  dataSource = [],
  remove,
  style,
  className,
  tagOption,
  fieldService,
}) => {
  return (
    <div className={classNames('tbox-filter-tags', className)} style={style}>
      {dataSource.map((compare, idx) => {
        const fieldMeta = fieldMetas.find(
          (fieldMeta) => fieldMeta.key === compare.source
        )
        if (fieldMeta) {
          const remote = fieldService
            ? (value: string[]) =>
                fieldService.findOfValues(fieldMeta.key, value)
            : undefined
          return (
            <FilterTag
              key={idx}
              compare={compare}
              fieldMeta={fieldMeta}
              remove={remove ? () => remove(idx) : undefined}
              remote={remote}
              {...tagOption}
            />
          )
        }
        return null
      })}
    </div>
  )
}
