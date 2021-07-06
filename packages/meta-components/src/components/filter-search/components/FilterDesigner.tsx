import React, { FC, useCallback, useState, useEffect, useMemo } from 'react'
import { Button, Space } from 'antd'
import { useLocale } from '@toy-box/toybox-shared'
import localeMap from '../locale'
import { FilterBuilder } from '../../filter-builder'
import { IFieldService } from '../../filter-builder/interface'
import { FilterType } from '..'

import '../styles/filterDesigner.less'

export interface IFilterDesignerProps {
  fieldMetas: Toybox.MetaSchema.Types.IFieldMeta[]
  value?: FilterType
  title: string
  filterFieldService?: IFieldService
  onChange?: (value: FilterType) => void
  onCancel?: () => void
  simple?: boolean
}

export const FilterDesigner: FC<IFilterDesignerProps> = ({
  value = [],
  fieldMetas,
  onChange,
  onCancel,
  title,
  filterFieldService,
  simple,
}) => {
  const locale = useLocale()
  const localeData = useMemo(() => localeMap[locale], [locale])
  const [compares, setCompares] =
    useState<Partial<Toybox.MetaSchema.Types.ICompareOperation>[]>(value)

  const handleSave = useCallback(
    () =>
      onChange &&
      onChange(
        compares.filter(
          (item) => item.source != null && item.op != null
        ) as FilterType
      ),
    [compares, onChange]
  )

  return (
    <div className="tbox-filter-designer">
      <h3>{title}</h3>
      <div className="tbox-filter-designer__builder-wrapper">
        <FilterBuilder
          fieldMetas={fieldMetas}
          value={compares}
          filterFieldService={filterFieldService}
          onChange={setCompares}
          simple={simple}
        />
      </div>
      <div className="tbox-filter-designer__bottom">
        <Space>
          <Button size="small" type="primary" onClick={handleSave}>
            {localeData.lang.filter['savebtn']}
          </Button>
          <Button size="small" onClick={onCancel}>
            {localeData.lang.filter['cancelBtn']}
          </Button>
        </Space>
      </div>
    </div>
  )
}
