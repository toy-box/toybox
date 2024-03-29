import React, { CSSProperties, FC, useMemo } from 'react'
import { Select } from 'antd'
import { useLocale } from '@toy-box/toybox-ui'
import locales from './locales'
import { optionGroups } from './config'

const { Option, OptGroup } = Select

export interface IDateUnitRangeProps<T> {
  value?: T
  onChange?: (value: T, text?: string) => void
  style?: CSSProperties
  className?: string
  placeholder?: string
  locale?: string
}

export function getText(labelValue: string, localeName = 'zh_CN') {
  const text = locales[localeName].lang[labelValue]
  return text || labelValue
}

export const DateUnitRange: FC<
  IDateUnitRangeProps<Toybox.MetaSchema.Types.DateFilterValueType>
> = ({ value, onChange, style, className, placeholder, locale = 'zh_CN' }) => {
  const innerLocale = useLocale()
  const localeName = useMemo(() => locale || innerLocale, [locale, innerLocale])

  return (
    <Select
      value={value}
      onChange={(value) =>
        onChange && onChange(value, getText(value, localeName))
      }
      style={style}
      className={className}
      placeholder={placeholder || getText('placeholder')}
    >
      {optionGroups.map((optGroup) => (
        <OptGroup label={getText(optGroup.group)} key={optGroup.group}>
          {optGroup.options.map((opt) => (
            <Option value={opt.labelValue} key={opt.labelValue}>
              {getText(opt.labelValue)}
            </Option>
          ))}
        </OptGroup>
      ))}
    </Select>
  )
}
