import React, {
  Ref,
  ForwardRefRenderFunction,
  useCallback,
  useMemo,
} from 'react'
import dayjs, { Dayjs } from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { PickerBaseProps } from 'antd/lib/date-picker/generatePicker'
import { MetaValueType } from '@toy-box/meta-schema'
import { DatePicker } from '@toy-box/toybox-ui'
import { omit } from '@toy-box/toybox-shared'
import { BaseFieldProps } from '../interface'

dayjs.extend(LocalizedFormat)

type ISODateString = string

export declare type FieldBasePickerProps = Omit<
  PickerBaseProps<Dayjs>,
  'mode' | 'picker' | 'format' | 'defaultValue' | 'value' | 'onChange'
> &
  Omit<BaseFieldProps, 'value' | 'onChange'>

export declare type FieldDateProps = FieldBasePickerProps & {
  dateMode?: PickerBaseProps<ISODateString>['mode']
  value?: ISODateString
  onChange?: (value?: ISODateString, dateString?: string) => void
}

const DateFormat = 'YYYY/MM/DD'
const DatetimeFormat = 'YYYY/MM/DD HH:mm:ss'

export const FieldDate = React.forwardRef<any, FieldDateProps>(
  (
    {
      disabled,
      value,
      placeholder,
      mode,
      field = { type: MetaValueType.DATE },
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
    const showTime = useMemo(
      () => field.type === MetaValueType.DATETIME,
      [field.type]
    )

    const defaultValue = useMemo(
      () =>
        field.defaultValue ? dayjs(field.defaultValue as string) : undefined,
      [field.defaultValue]
    )

    const innerFormat = useMemo(
      () =>
        field.format || field.type === MetaValueType.DATE
          ? DateFormat
          : DatetimeFormat,
      [field.format]
    )

    const innerOnChange = useCallback(
      (date: Dayjs | null, dateString = '') => {
        onChange &&
          onChange(
            date ? dayjs(dateString).toISOString() : undefined,
            dateString
          )
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
        showTime={showTime ? { format: 'HH:mm:ss' } : false}
        onOpenChange={onOpenChange}
        {...omit(otherProps, ['format'])}
      />
    )
  }
)

FieldDate.displayName = 'FieldDate'
