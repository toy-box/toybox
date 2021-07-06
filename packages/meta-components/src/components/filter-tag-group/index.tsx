import React, { FC, CSSProperties } from 'react'
import classNames from 'classnames'
import { FilterTag, IFilterTagProps } from '../filter-tag'
import { IFieldService } from '../filter-builder'

export interface IFilterTagGroupProps {
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

export const FilterTagGroup: FC<IFilterTagGroupProps> = ({
  fieldMetas = [],
  dataSource = [],
  remove,
  style,
  className,
  tagOption,
  fieldService,
}) => {
  return (
    <div
      className={classNames('tbox-filter-tag-group', className)}
      style={style}
    >
      {dataSource.map((compare, idx) => {
        const fieldMeta = fieldMetas.find(
          (fieldMeta) => fieldMeta.key === compare.source
        )
        if (fieldMeta) {
          const findOfValues = fieldService
            ? fieldService.findOfValues
            : undefined
          const remote = findOfValues
            ? (value: string[]) => findOfValues(fieldMeta.key, value)
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
