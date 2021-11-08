import React, { CSSProperties, useCallback, useMemo } from 'react'
import { Button } from 'antd'
import classNames from 'classnames'
import update from 'immutability-helper'
import { AddCircleLine } from '@airclass/icons'
import { useLocale } from '@toy-box/toybox-shared'
import { CompareOP } from '@toy-box/meta-schema'
import { CompareOperation } from './CompareOperation'
import { localeMap } from '../locale'
import {
  IFieldService,
  IUncheckCompare,
  IspecialOption,
  OpTypeProps,
  IoperatOption,
} from '../interface'
import { FilterBuilderContext } from '../context'

import '../styles/index.less'

export interface IFilterBuilderProps {
  fieldMetas:
    | Toybox.MetaSchema.Types.IFieldMeta[]
    | Toybox.MetaSchema.Types.IFieldGroupMeta[]
  value?: IUncheckCompare[]
  filterFieldService?: IFieldService
  onChange: (compares: IUncheckCompare[]) => void
  addText?: string
  className?: string
  style?: CSSProperties
  layout?: 'horizontal' | 'vertical'
  specialMode?: boolean
  specialOptions?: IspecialOption[]
  simple?: boolean
  operatType?: OpTypeProps
  customValueElement?: React.ReactElement
}

export const FilterBuilder = ({
  value = [],
  fieldMetas = [],
  filterFieldService,
  onChange,
  addText,
  className,
  style,
  layout = 'horizontal',
  specialMode,
  specialOptions,
  simple,
  operatType,
  customValueElement,
}: IFilterBuilderProps) => {
  const locale = useLocale()
  const localeData = useMemo(() => localeMap[locale], [locale])

  const addFilter = () => {
    onChange &&
      onChange(update(value, { $push: simple ? [{ op: CompareOP.EQ }] : [{}] }))
  }
  return (
    <FilterBuilderContext.Provider
      value={{
        value,
        onChange,
        simple,
        specialMode,
        specialOptions,
        operatType,
        customValueElement,
      }}
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
            layout={layout}
          />
        ))}
        <Button onClick={addFilter} type="dashed" icon={<AddCircleLine />}>
          {addText || localeData.lang.operate['add']}
        </Button>
      </div>
    </FilterBuilderContext.Provider>
  )
}
