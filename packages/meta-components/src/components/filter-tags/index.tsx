import React, { FC, CSSProperties } from 'react'
import classNames from 'classnames'
import { FilterTag, IFilterTagProps } from '../filter-tag'

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
}

export const FilterTags: FC<IFilterTagsProps> = ({
  fieldMetas = [],
  dataSource = [],
  remove,
  style,
  className,
  tagOption,
}) => {
  return (
    <div className={classNames('tbox-filter-tags', className)} style={style}>
      {dataSource.map((compare, idx) => {
        const fieldMeta = fieldMetas.find(
          (fieldMeta) => fieldMeta.key === compare.source
        )
        return fieldMeta ? (
          <FilterTag
            key={idx}
            compare={compare}
            fieldMeta={fieldMeta}
            remove={remove ? () => remove(idx) : undefined}
            {...tagOption}
          />
        ) : null
      })}
    </div>
  )
}
