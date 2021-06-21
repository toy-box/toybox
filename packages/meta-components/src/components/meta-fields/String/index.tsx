import { Input, InputProps } from 'antd'
import React, {
  useRef,
  useImperativeHandle,
  Ref,
  ForwardRefRenderFunction,
} from 'react'

import { BaseFieldProps } from '../interface'

export declare type FieldStringProps = Omit<
  BaseFieldProps,
  'value' | 'onChange' | 'onPressEnter'
> &
  Omit<InputProps, 'onChange' | 'onPressEnter' | 'defaultValue'> & {
    onChange?: (value: string) => void
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
