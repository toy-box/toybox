import React, { FC, useState, useRef, ReactNode, useEffect } from 'react'
import { Input } from 'antd'
import classNames from 'classnames'
import { InputProps } from 'antd/lib/input'

import './styles'

export type IImpInputProps = {
  onSave?: (value: string | number | readonly string[] | undefined) => void
  inputClassName?: string
  icon?: ReactNode
  size?: string
} & Omit<InputProps, 'size'>

export const ImpInput: FC<IImpInputProps> = ({
  value,
  onSave,
  onPressEnter,
  onChange,
  onBlur,
  disabled,
  className,
  style,
  icon,
  size,
  width,
  inputClassName,
  ...other
}) => {
  const inputRef = useRef(null)
  const [active, setActive] = useState(false)
  const [innerValue, setInnerValue] = useState(value)

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const activeHandle = () => {
    if (disabled) {
      return
    }
    setActive(true)
    setTimeout(() => inputRef.current?.focus(), 300)
  }

  const onPressEnterHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setActive(false)
    if (onPressEnter != null && typeof onPressEnter === 'function') {
      onPressEnter(e)
    }
    onSave && onSave(innerValue)
  }

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value)
    if (onChange != null && typeof onChange === 'function') {
      onChange(e)
    }
  }

  const onBlurHandle = (e: React.FocusEvent<HTMLInputElement>) => {
    setActive(false)
    if (onBlur != null && typeof onBlur === 'function') {
      onBlur(e)
    }
    onSave && onSave(innerValue)
  }
  const sizeStyle = React.useMemo(() => ({ fontSize: size }), [size])
  const widthStyle = React.useMemo(
    () => ({
      width,
    }),
    [width]
  )

  const inputStyle = React.useMemo(
    () => ({
      ...widthStyle,
      ...sizeStyle,
    }),
    [sizeStyle, widthStyle]
  )

  return (
    <div className={classNames('tbox-imp-input', className)} style={style}>
      {active ? (
        <Input
          ref={inputRef}
          className={inputClassName}
          onBlur={onBlurHandle}
          onPressEnter={onPressEnterHandle}
          onChange={onChangeHandle}
          value={innerValue}
          style={inputStyle}
          {...other}
        />
      ) : (
        <button
          className={classNames('tbox-imp-input__button', { disabled })}
          onClick={activeHandle}
        >
          <span
            className={classNames('tbox-imp-input__text')}
            style={sizeStyle}
          >
            {value}
            <i className={'tbox-imp-input__icon'}>{icon}</i>
          </span>
        </button>
      )}
    </div>
  )
}
