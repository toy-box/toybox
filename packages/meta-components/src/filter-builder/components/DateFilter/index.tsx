import React, { CSSProperties, FC, useContext, useMemo } from 'react'
import { Select } from 'antd'
import { useLocale } from '@toy-box/toybox-shared'
import locales from './locales'
import { optionGroups } from './config'

const { Option, OptGroup } = Select

export interface DateFilterProps<T> {
  value?: T
  onChange?: (value: T, text?: string) => void
  style?: CSSProperties
  className?: string
  placeholder?: string
  locale?: string
}

function getText(labelValue: string, localeName = 'zh_CN') {
  const text = locales[localeName].lang[labelValue]
  return text || labelValue
}

export const DateFilter: FC<
  DateFilterProps<Toybox.MetaSchema.Types.DateFilterValueType>
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
