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
import { CompareOP } from '@toy-box/meta-schema'
import { CompareOperation } from './CompareOperation'
import { localeMap } from '../locale'
import { IFieldService, IUncheckCompare, IspecialOption } from '../interface'
import { FilterBuilderContext } from '../context'

import '../styles/index.less'
import classNames from 'classnames'

export interface IFilterBuilderProps {
  fieldMetas: Toybox.MetaSchema.Types.IFieldMeta[]
  value?: IUncheckCompare[]
  filterFieldService?: IFieldService
  onChange: (compares: IUncheckCompare[]) => void
  addText?: string
  className?: string
  style?: CSSProperties
  /**
   * @description 简单模式，各种字段类型只有等于比较操作
   */
  logicFilter?: boolean
  specialMode?: boolean
  specialOptions?: IspecialOption[]
}

export const FilterBuilder = ({
  value = [],
  fieldMetas,
  filterFieldService,
  onChange,
  addText,
  className,
  style,
  logicFilter,
  specialMode,
  specialOptions,
}: IFilterBuilderProps) => {
  const locale = useLocale()
  const localeData = useMemo(() => localeMap[locale], [locale])

  const addFilter = () => {
    onChange &&
      onChange(
        update(value, { $push: logicFilter ? [{ op: CompareOP.EQ }] : [{}] })
      )
  }

  return (
    <FilterBuilderContext.Provider
      value={{ value, onChange, logicFilter, specialMode, specialOptions }}
    >
      <div className={classNames(className)} style={style}>
        {value.map((filterItem, idx) => (
          <CompareOperation
            key={idx}
            index={idx}
            fieldMetas={fieldMetas}
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
