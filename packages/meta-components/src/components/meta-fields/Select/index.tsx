import React, {
  ForwardRefRenderFunction,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from 'react'
import { Select, SelectProps } from '@toy-box/toybox-ui'
import { BaseFieldProps } from '../interface'

export type SelectValue = React.ReactText | React.ReactText[]

export declare type FieldSelectProps = Omit<
  BaseFieldProps,
  'onChange' | 'value'
> &
  Omit<SelectProps, 'mode' | 'defaultValue'> & {
    selectMode?: SelectProps['mode']
  }

export const FieldSelect = React.forwardRef(
  (
    { mode, field, selectMode, onClick, ...otherProps }: FieldSelectProps,
    ref
  ) => {
    const inputRef = useRef<any>()
    useImperativeHandle(ref, () => ({
      ...(inputRef.current || {}),
    }))

    return (
      <div onClick={onClick}>
        <Select
          ref={inputRef}
          mode={selectMode}
          defaultValue={field.defaultValue}
          options={field.options}
          readMode={mode === 'read'}
          {...otherProps}
        />
      </div>
    )
  }
)

FieldSelect.displayName = 'FieldSelect'
