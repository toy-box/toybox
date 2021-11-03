import { Rate, RateProps } from 'antd'
import { MetaValueType } from '@toy-box/meta-schema'
import React, { useRef, useImperativeHandle } from 'react'

import { BaseFieldProps } from '../interface'

export interface FieldRateProps
  extends Omit<BaseFieldProps, 'value' | 'onChange'>,
    RateProps {}

export const FieldRate = React.forwardRef<any, FieldRateProps>(
  (
    {
      mode,
      value,
      disabled,
      style,
      field = { type: MetaValueType.RATE },
      onChange,
    },
    ref
  ) => {
    const inputRef = useRef()
    useImperativeHandle(
      ref,
      () => ({
        ...(inputRef.current || {}),
      }),
      []
    )

    if (mode === 'read') {
      return <Rate value={value} disabled style={style} count={field.maximum} />
    }
    return (
      <Rate
        value={value}
        onChange={onChange}
        defaultValue={field.defaultValue}
        ref={inputRef}
        disabled={disabled}
        style={style}
        count={field.maximum}
      />
    )
  }
)

FieldRate.displayName = 'FieldRate'
