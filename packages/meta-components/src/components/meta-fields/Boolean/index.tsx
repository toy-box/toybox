import React, {
  ForwardRefRenderFunction,
  useMemo,
  useRef,
  useImperativeHandle,
  Ref,
} from 'react'
import get from 'lodash.get'
import { Switch } from 'antd'
import { useLocale } from '@toy-box/toybox-shared'
import { BaseFieldProps } from '../interface'
import localeMap from './locale'

export interface FieldBooleanProps extends BaseFieldProps {
  value?: boolean
  textValues?: [string, string]
  onChange?: (value: boolean) => void
}

const Boolean: ForwardRefRenderFunction<any, FieldBooleanProps> = (
  { onChange, value, textValues, field, mode = 'edit', onClick },
  ref: Ref<any>
) => {
  const locale = useLocale()
  const localeData = useMemo(() => localeMap[locale], [locale])
  const inputRef = useRef<HTMLElement>(null)
  useImperativeHandle(
    ref,
    () => ({
      ...(inputRef.current || {}),
    }),
    []
  )
  const innerTextValues = useMemo(() => {
    return textValues
      ? textValues
      : [
          get(localeData.lang, 'value.false'),
          get(localeData.lang, 'value.true'),
        ]
  }, [textValues])

  const textValue = useMemo(() => {
    if (value === true) {
      return innerTextValues[1]
    } else if (value === false) {
      return innerTextValues[0]
    }
    return null
  }, [innerTextValues, value])
  switch (mode) {
    case 'read':
      return <div onClick={onClick}>{textValue}</div>
    case 'edit':
    case 'update':
    default:
      return (
        <Switch
          ref={inputRef}
          onChange={onChange}
          checkedChildren={innerTextValues[1]}
          unCheckedChildren={innerTextValues[0]}
          checked={value}
          defaultChecked={field.defaultValue}
        />
      )
  }
}

export const FieldBoolean = React.forwardRef(Boolean)