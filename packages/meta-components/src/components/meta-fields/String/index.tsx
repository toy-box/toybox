import { Input, InputProps } from 'antd'
import React, {
  Ref,
  ForwardRefRenderFunction,
  useRef,
  useMemo,
  useImperativeHandle,
} from 'react'
import { DatePicker } from '@toy-box/toybox-ui'
import dayjs from 'dayjs'

import { BaseFieldProps } from '../interface'

export declare type FieldStringProps = Omit<
  BaseFieldProps,
  'value' | 'onChange' | 'onPressEnter'
> &
  Omit<InputProps, 'onChange' | 'onPressEnter' | 'defaultValue'> & {
    onChange?: (value?: string) => void
    onPressEnter?: () => void
  }

const FieldStringFC: ForwardRefRenderFunction<any, FieldStringProps> = (
  {
    field,
    mode,
    value,
    placeholder,
    disabled,
    onClick,
    onChange,
    onPressEnter,
    ...otherProps
  },
  ref: Ref<any>
) => {
  const inputRef = useRef<any>()
  useImperativeHandle(
    ref,
    () => ({
      ...(inputRef.current || {}),
    }),
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
        onChange={(date) =>
          onChange && onChange(date ? date.format('YYYY-MM-DD') : undefined)
        }
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
      onChange={(e) => onChange && onChange(e.target.value)}
      onPressEnter={(e) => onPressEnter && onPressEnter()}
      defaultValue={field.defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      {...otherProps}
    />
  )
}

export const FieldString = React.forwardRef(FieldStringFC)
