import { InputNumber, InputNumberProps } from 'antd'
import React, {
  useRef,
  useImperativeHandle,
  Ref,
  ForwardRefRenderFunction,
} from 'react'

import { BaseFieldProps } from '../interface'

export type FieldNumberProps = Omit<
  BaseFieldProps,
  'value' | 'onChange' | 'onPressEnter' | 'onClick'
> &
  Omit<InputNumberProps, 'defaultValue' | 'onPressEnter' | 'min' | 'max'> & {
    onPressEnter?: (value?: number | string) => void
  }

const FieldNumberFC: ForwardRefRenderFunction<any, FieldNumberProps> = (
  { mode, value, style, onChange, onClick, onPressEnter, field, ...otherProps },
  ref: Ref<any>
) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
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
    <InputNumber
      ref={inputRef}
      value={value}
      onChange={onChange}
      defaultValue={field.defaultValue}
      style={{ ...style, width: '100%' }}
      precision={field.precision}
      min={field.minimum}
      max={field.maximum}
      onPressEnter={() =>
        onPressEnter && onPressEnter(value ? value : Number(value))
      }
      {...otherProps}
    />
  )
}

export const FieldNumber = React.forwardRef(FieldNumberFC)