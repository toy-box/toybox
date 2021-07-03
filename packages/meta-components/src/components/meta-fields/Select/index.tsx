import React, {
  ForwardRefRenderFunction,
  useRef,
  useImperativeHandle,
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

const FieldSelectFC: ForwardRefRenderFunction<any, FieldSelectProps> = (
  { mode, field, selectMode, onClick, ...otherProps },
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

export const FieldSelect = React.forwardRef(FieldSelectFC)