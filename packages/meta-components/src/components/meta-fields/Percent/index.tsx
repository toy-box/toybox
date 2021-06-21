import { InputNumber, InputNumberProps } from 'antd'
import React, {
  useRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  Fragment,
  Ref,
  ForwardRefRenderFunction,
  CSSProperties,
} from 'react'
import { BaseFieldProps } from '../interface'
import {
  getColorByRealValue,
  getSymbolByRealValue,
  getRealTextWithPrecision,
} from './util'

// export interface FieldPercentProps extends BaseFieldProps {
//   value?: number
//   placeholder?: string
//   onChange?: (value?: number) => void
//   showColor?: boolean
//   showSymbol?: boolean
//   suffix?: string
//   precision?: number
//   style?: CSSProperties
// }

export type FieldPercentProps = Omit<
  BaseFieldProps,
  'value' | 'onChange' | 'onClick' | 'onPressEnter'
> &
  Omit<InputNumberProps, 'defaultValue' | 'onPressEnter' | 'min' | 'max'> & {
    suffix?: string
    showColor?: boolean
    showSymbol?: boolean
    onPressEnter?: (value?: number | string) => void
  }

const FieldPercentFC: ForwardRefRenderFunction<any, FieldPercentProps> = (
  {
    mode,
    value,
    field,
    placeholder,
    disabled,
    onChange,
    onClick,
    showSymbol,
    showColor,
    suffix = '%',
    precision = 2,
    style,
    onPressEnter,
    ...otherProps
  }: FieldPercentProps,
  ref: Ref<any>
) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const innerValue = useMemo(
    () =>
      value != null
        ? Math.round(Number(value) * Math.pow(10, precision + 2)) /
          Math.pow(10, precision)
        : undefined,
    [value]
  )
  const handleChange = useCallback(
    (value?: number) =>
      onChange &&
      onChange(
        value != null
          ? Math.round(Number(value) * Math.pow(10, precision)) /
              Math.pow(10, precision + 2)
          : Number(value)
      ),
    [onChange]
  ) as (value: number) => void

  const hanldeParser = useCallback(
    (value) => {
      if (value != null) {
        return value == suffix ? undefined : Number(value.replace(suffix, ''))
      }
      return undefined
    },
    [suffix]
  ) as (value?: string) => number

  const handleFormatter = useCallback(
    (value) => (value != null ? `${value}${suffix}` : undefined),
    [suffix]
  ) as (value?: number) => string

  useImperativeHandle(
    ref,
    () => ({
      ...(inputRef.current || {}),
    }),
    []
  )

  if (mode === 'read') {
    const style = showColor ? { color: getColorByRealValue(Number(value)) } : {}
    if (value == null) {
      return (
        <span style={style} onClick={onClick}>
          -
        </span>
      )
    }
    return (
      <span style={style} onClick={onClick}>
        {showSymbol && (
          <Fragment>{getSymbolByRealValue(Number(value))} </Fragment>
        )}
        {getRealTextWithPrecision(Math.abs(Number(value)), precision)}
        {suffix}
      </span>
    )
  }
  return (
    <InputNumber
      value={innerValue}
      onChange={handleChange}
      defaultValue={field.defaultValue}
      placeholder={placeholder}
      ref={inputRef}
      disabled={disabled}
      formatter={handleFormatter}
      parser={hanldeParser}
      style={{ ...style, width: '100%' }}
      precision={precision}
      onPressEnter={() => onPressEnter && onPressEnter(value)}
      {...otherProps}
    />
  )
}

export const FieldPercent = React.forwardRef(FieldPercentFC)
