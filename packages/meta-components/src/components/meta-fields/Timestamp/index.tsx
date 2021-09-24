import React, { useCallback, useMemo } from 'react'
import { MetaValueType } from '@toy-box/meta-schema'
import dayjs, { Dayjs } from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { PickerBaseProps } from 'antd/lib/date-picker/generatePicker'
import { DatePicker } from '@toy-box/toybox-ui'
import { omit } from '@toy-box/toybox-shared'
import { BaseFieldProps } from '../interface'

dayjs.extend(LocalizedFormat)

declare type FieldBasePickerProps = Omit<
  PickerBaseProps<Dayjs>,
  'mode' | 'picker' | 'format' | 'defaultValue' | 'value' | 'onChange'
> &
  Omit<BaseFieldProps, 'value' | 'onChange'>

export declare type FieldTimestampProps = FieldBasePickerProps & {
  dateMode?: PickerBaseProps<number>['mode']
  value?: number
  onChange?: (value?: number, dateString?: string) => void
}

const DateFormat = 'YYYY/MM/DD'
const DatetimeFormat = 'YYYY/MM/DD HH:mm:ss'

export const FieldTimestamp = React.forwardRef<any, FieldTimestampProps>(
  (
    {
      disabled,
      value,
      placeholder,
      mode,
      field = { type: MetaValueType.TIMESTAMP },
      open,
      bordered,
      onChange,
      onClick,
      onOpenChange,
      dateMode,
      ...otherProps
    },
    ref
  ) => {
    const defaultValue = useMemo(
      () =>
        field.defaultValue ? dayjs(field.defaultValue as string) : undefined,
      [field.defaultValue]
    )

    const innerFormat = useMemo(
      () => (field.format ? DateFormat : DatetimeFormat),
      [field.format]
    )

    const innerOnChange = useCallback(
      (date: Dayjs | null, dateString: string = '') => {
        onChange && onChange(date ? dayjs(date).unix() : undefined, dateString)
      },
      [innerFormat, onChange]
    )

    const innerValue = useMemo(
      () => (value ? dayjs(value) : undefined),
      [value]
    )

    const text = useMemo(
      () => (value ? dayjs(value).format(innerFormat) : '-'),
      [value, innerFormat]
    )

    if (mode === 'read') {
      return (
        <span ref={ref} onClick={onClick}>
          {text}
        </span>
      )
    }
    return (
      <DatePicker
        ref={ref}
        value={innerValue}
        bordered={bordered}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={innerOnChange}
        open={open}
        style={{ width: '100%' }}
        mode={dateMode}
        showTime={{ format: 'HH:mm:ss' }}
        onOpenChange={onOpenChange}
        {...omit(otherProps, ['format'])}
      />
    )
  }
)

FieldTimestamp.displayName = 'FieldTimestamp'
