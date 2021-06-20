import React, {
  CSSProperties,
  FC,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { Button } from 'antd'
import update from 'immutability-helper'
import { AddCircleLine } from '@airclass/icons'
import { useLocale } from '@toy-box/toybox-shared'
import { CompareOperation } from './CompareOperation'
import localeMap from '../locale'
import { FieldService, IUncheckCompare } from '../interface'
import { FilterBuilderContext } from '../context'

import '../styles/index.less'
import classNames from 'classnames'

export interface IFilterBuilderProps {
  filterFieldMetas: Toybox.MetaSchema.Types.IFieldMeta[]
  value?: IUncheckCompare[]
  filterFieldService?: FieldService
  onChange: (compares: IUncheckCompare[]) => void
  addText?: string
  className?: string
  style?: CSSProperties
}

export const FilterBuilder = ({
  value = [],
  filterFieldMetas,
  filterFieldService,
  onChange,
  addText,
  className,
  style,
}: IFilterBuilderProps) => {
  const locale = useLocale()
  const localeData = useMemo(() => localeMap[locale], [locale])

  const addFilter = () => {
    onChange && onChange(update(value, { $push: [{}] }))
  }

  return (
    <FilterBuilderContext.Provider value={{ value, onChange }}>
      <div className={classNames(className)} style={style}>
        {value.map((filterItem, idx) => (
          <CompareOperation
            key={idx}
            index={idx}
            filterFieldMetas={filterFieldMetas}
            compare={filterItem}
            localeData={localeData}
            filterFieldService={filterFieldService}
          />
        ))}
        <Button onClick={addFilter} type="dashed" icon={<AddCircleLine />}>
          {addText || localeData.lang.operate['add']}
        </Button>
      </div>
    </FilterBuilderContext.Provider>
  )
}
