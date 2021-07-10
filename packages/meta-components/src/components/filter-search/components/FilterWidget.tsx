import React, { FC, useMemo } from 'react'
import { Popover, PopoverProps, Tooltip } from 'antd'
import { Button } from '@toy-box/toybox-ui'
import { Filter3Line } from '@airclass/icons'
import { useLocale } from '@toy-box/toybox-shared'
import { FilterDesigner, IFilterDesignerProps } from './FilterDesigner'
import localeMap from '../locale'

export interface IFilterWidgetProps
  extends Omit<IFilterDesignerProps, 'title'> {
  title?: string
  visible: boolean
  onVisibleChange: (visible: boolean) => void
  placement?: PopoverProps['placement']
}

export const FilterWidget: FC<IFilterWidgetProps> = ({
  title,
  fieldMetas,
  value,
  filterFieldService,
  onChange,
  onCancel,
  simple,
  visible,
  onVisibleChange,
  placement = 'bottomRight',
}) => {
  const locale = useLocale()
  const localeData = useMemo(() => localeMap[locale], [locale])

  const filterContainer = useMemo(() => {
    return (
      <FilterDesigner
        fieldMetas={fieldMetas}
        value={value}
        title={localeData.lang.filter['defaultTitle']}
        filterFieldService={filterFieldService}
        onChange={onChange}
        onCancel={onCancel}
        simple={simple}
      />
    )
  }, [fieldMetas, value, filterFieldService])

  return (
    <Popover
      placement={placement}
      content={filterContainer}
      trigger="click"
      visible={visible}
      onVisibleChange={onVisibleChange}
      destroyTooltipOnHide={false}
    >
      <Tooltip placement="top" title={title || localeData.lang.filter['tip']}>
        <Button icon={<Filter3Line />} />
      </Tooltip>
    </Popover>
  )
}
