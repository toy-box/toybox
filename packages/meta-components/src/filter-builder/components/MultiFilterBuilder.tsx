import React, { FC, useCallback, useContext, useMemo } from 'react'
import { Button } from 'antd'
import LocaleContext from 'antd/lib/locale-provider/context'
import update from 'immutability-helper'
import { AddCircleFill } from '@airclass/icons'
import { FilterBuilder } from './FilterBuilder'
import localeMap from '../locale'
import { FieldService } from '../interface'

import '../styles/multi.less'

export interface IMultiFilterBuilderProps {
  segmentlogic?: Toybox.MetaSchema.Types.LogicOP
  filterFieldMetas: Toybox.MetaSchema.Types.IFieldMeta[]
  value?: Toybox.MetaSchema.Types.ILogicFilter[]
  filterFieldService?: FieldService
  onChange: (value: Toybox.MetaSchema.Types.ILogicFilter[]) => void
  addText?: string
  addSegmentText?: string
}

export const MultiFilterBuilder: FC<IMultiFilterBuilderProps> = ({
  segmentlogic = Toybox.MetaSchema.Types.LogicOP.AND,
  filterFieldMetas,
  value = [],
  filterFieldService,
  onChange,
  addText,
  addSegmentText,
}) => {
  const antLocale = useContext(LocaleContext)
  const locale = useMemo(
    () => (antLocale && antLocale.locale ? antLocale.locale : 'zh_CN'),
    [antLocale]
  )
  const localeData = useMemo(() => localeMap[locale || 'zh_CN'], [locale])

  const handleFilterChange = useCallback(
    (
      compares: Partial<Toybox.MetaSchema.Types.ICompareOperation>[],
      index: number
    ) => {
      if (compares == null || compares.length === 0) {
        onChange && onChange(update(value, { $splice: [[index, 1]] }))
      } else {
        onChange &&
          onChange(update(value, { [index]: { compares: { $set: compares } } }))
      }
    },
    [onChange, value]
  )

  const FilterSegment = ({
    logicFilter,
    index,
  }: {
    logicFilter: Toybox.MetaSchema.Types.ILogicFilter
    index: number
  }) => {
    return (
      <div className="tbox-multi-filter-segment">
        <FilterBuilder
          value={logicFilter.compares}
          filterFieldMetas={filterFieldMetas}
          filterFieldService={filterFieldService}
          onChange={(compares) => handleFilterChange(compares, index)}
          addText={addText}
        />
      </div>
    )
  }

  const addSegment = useCallback(() => {
    const newSegment: Toybox.MetaSchema.Types.ILogicFilter = {
      logic: segmentlogic,
      compares: [{ source: undefined, op: undefined, target: undefined }],
    }
    onChange && onChange(update(value, { $push: [newSegment] }))
  }, [onChange, value])

  return (
    <div className="tbox-multi-filter">
      {value.map((logicFilter, index) => (
        <FilterSegment key={index} logicFilter={logicFilter} index={index} />
      ))}
      <div className="tbox-multi-filter-panel">
        <Button type="dashed" onClick={addSegment} icon={<AddCircleFill />}>
          {addSegmentText || localeData.lang.operate['addSegment']}
        </Button>
      </div>
    </div>
  )
}
