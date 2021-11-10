import React, { CSSProperties, FC, useMemo } from 'react'
import { Select } from 'antd'
import { useLocale } from '@toy-box/toybox-shared'
import locales from './locales'
import { optionGroups } from './config'

const { Option, OptGroup } = Select

const DateUnitRangeReg = /^(DAY|MONTH|YEAR)(:(-?[1-9]\d*|0)){2}$/

export type DateUnitValue = 'DAY' | 'MONTH' | 'YEAR'

export type DateUnitRangeValue = {
  unit: DateUnitValue
  start: number
  end: number
}

export type DateUnitRangeProps<T> = {
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

export const DateUnitRange: FC<DateUnitRangeProps<string>> = ({
  value,
  onChange,
  style,
  className,
  placeholder,
  locale = 'zh_CN',
}) => {
  const innerValue = useMemo(() => {
    return parserDateUnitRange(value)
  }, [value])

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

const parserDateUnitRange = (value: string) => {
  if (DateUnitRangeReg.test(value)) {
    return {
      unit: value.match(/^(DAY|MONTH|YEAR)/)[0],
      start: parseInt(value.match(/ d(-?[1-9]\d*|0)/)[0]),
      end: parseInt(value.match(/ (-?[1-9]\d*|0)$/)[0]),
    }
  }
  return null
}
