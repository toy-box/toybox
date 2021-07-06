import React, {
  ForwardRefRenderFunction,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from 'react'
import { Select, SelectProps, Option, OptGroup } from '@toy-box/toybox-ui'
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
  { mode, field, selectMode, quoteOptions, onClick, ...otherProps },
  ref
) => {
  const inputRef = useRef<any>()
  useImperativeHandle(ref, () => ({
    ...(inputRef.current || {}),
  }))

  const isDisabled = useCallback(
    (child) => {
      if (!child.key) return false
      return child.key !== field.key
    },
    [field]
  )

  const optGroup = useMemo(() => {
    const mergeOptions = quoteOptions || field.options || []
    return mergeOptions?.map((option) =>
      option.children ? (
        <OptGroup key={option.value} label={option.label}>
          {option.children.map((child) => (
            <Option
              disabled={isDisabled(child)}
              key={child.value}
              value={child.value}
            >
              {child.label}
            </Option>
          ))}
        </OptGroup>
      ) : (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      )
    )
  }, [field.options, quoteOptions])

  return (
    <div onClick={onClick}>
      <Select
        ref={inputRef}
        mode={selectMode}
        defaultValue={field.defaultValue}
        options={quoteOptions || field.options}
        readMode={mode === 'read'}
        {...otherProps}
      >
        {optGroup}
      </Select>
    </div>
  )
}

export const FieldSelect = React.forwardRef(FieldSelectFC)
