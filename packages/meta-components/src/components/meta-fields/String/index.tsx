import { Input, InputProps } from 'antd'
import { MetaValueType } from '@toy-box/meta-schema'
import React, { useCallback, useRef, useImperativeHandle } from 'react'
import { DatePicker } from '@toy-box/toybox-ui'
import dayjs, { Dayjs } from 'dayjs'

import { BaseFieldProps } from '../interface'

export declare type FieldStringProps = Omit<
  BaseFieldProps,
  'value' | 'onChange' | 'onPressEnter'
> &
  Omit<InputProps, 'onChange' | 'onPressEnter' | 'defaultValue'> & {
    onChange?: (value?: string) => void
    onPressEnter?: () => void
    onClear?: () => void
  }

export const FieldString = React.forwardRef<any, FieldStringProps>(
  (
    {
      field = { type: MetaValueType.STRING },
      mode,
      value,
      placeholder,
      disabled,
      onClick,
      onChange,
      onPressEnter,
      onClear,
      ...otherProps
    },
    ref
  ) => {
    const inputRef = useRef<any>()
    useImperativeHandle(
      ref,
      () => ({
        ...(inputRef.current || {}),
      }),
      []
    )

    const handleDateChange = useCallback((date: Dayjs) => {
      onChange && onChange(date ? date.format('YYYY-MM-DD') : undefined)
      if (date == null) {
        onClear && onClear()
      }
    }, [])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(e.target.value)
        if (e.target.value === '') {
          onClear && onClear()
        }
      },
      []
    )

    if (mode === 'read') {
      const dom = value || '-'
      return <span onClick={onClick}>{dom}</span>
    }
    if (field.format === 'date') {
      return (
        <DatePicker
          ref={inputRef}
          picker="date"
          value={value ? dayjs(value as string) : undefined}
          onChange={handleDateChange}
          defaultValue={
            field.defaultValue ? dayjs(field.defaultValue as string) : undefined
          }
          placeholder={placeholder}
          disabled={disabled}
          style={otherProps.style}
          size={otherProps.size}
          className={otherProps.className}
        />
      )
    }
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target?.value)
        }
        onPressEnter={(e) => onPressEnter && onPressEnter()}
        defaultValue={field.defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        {...otherProps}
      />
    )
  }
)

FieldString.displayName = 'FieldString'
