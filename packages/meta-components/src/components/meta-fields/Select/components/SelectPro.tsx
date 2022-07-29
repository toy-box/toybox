import React, {
  ForwardRefRenderFunction,
  useRef,
  useMemo,
  useContext,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { Divider, Input } from 'antd'
import { Search2Line } from '@airclass/icons'
import { default as Select, SelectProps } from 'antd/lib/select'
import SizeContext from 'antd/lib/config-provider/SizeContext'
import debounce from 'lodash.debounce'
import intersection from 'lodash.intersection'
import { useFetchOptions } from '../hooks'
import { OptionItem, OptionItemsType, OptionReturnType } from '../interface'

declare type SelectValue = React.ReactText | React.ReactText[]

const { Option, OptGroup } = Select

export interface SelectProProps extends SelectProps<SelectValue> {
  value?: SelectValue
  defaultValue?: SelectValue
  params?: any
  remote?: (key: string, params?: any) => Promise<OptionItem[]>
  remoteByValue?: (
    value: string | number | Array<string | number>,
    params?: any
  ) => Promise<OptionItem[]>
  readMode?: boolean
  showSearch?: boolean
  /**
   * @description 自定义只读模式选项渲染方法
   */
  itemRender?: (value: string | number, title: ReactNode) => ReactNode
  /**
   * @description 是否在选线中显示搜索框,目前使用有问题
   * @default true
   */
  optionSearch?: boolean
}

const defaultRemote = () =>
  new Promise<OptionItem[]>((resolve) => {
    resolve([])
  })

const SelectRF: ForwardRefRenderFunction<any, SelectProProps> = (
  {
    defaultValue,
    value,
    placeholder,
    params,
    mode,
    options,
    readMode,
    onChange,
    remote,
    remoteByValue,
    showSearch = false,
    itemRender,
    optionSearch,
    ...otherProps
  },
  ref
) => {
  const [loading, remoteOptions, fetchData] = useFetchOptions(
    remote || defaultRemote,
    params
  )
  const [initOptions, setInitOptions] = useState<OptionItemsType>([])
  const [initialed, setInitialed] = useState(false)
  const [localOptions, setLocalOptions] = useState<OptionItemsType>(
    options || []
  )
  const [optionSearchKey, setOptionSearchKey] = useState<string>()
  const inputRef = useRef<any>()
  const searchRef = useRef<any>()
  const size = useContext(SizeContext)

  const mergeOptions = useMemo(() => {
    if (remote == null) {
      return localOptions
    }
    if (
      intersection(
        remoteOptions.map((o) => o.value),
        (initOptions || []).map((io) => io.value)
      ).length === initOptions.length
    ) {
      return remoteOptions
    }
    if (initOptions != null && initOptions.length > 0) {
      return [...initOptions].concat(...remoteOptions)
    }
    return remoteOptions
  }, [initOptions, localOptions, remoteOptions, remote])

  const innerValue = useMemo(() => {
    if (remote && !initialed) {
      return
    }
    return value
  }, [initialed, remote, value])

  const current = useMemo(() => {
    if (mode === 'multiple') {
      return mergeOptions
        ? mergeOptions.filter((opt) =>
            ((innerValue as React.ReactText[]) || []).some(
              (v) => v === opt.value
            )
          )
        : null
    }
    return mergeOptions
      ? mergeOptions.find((opt) => opt.value === innerValue)
      : null
  }, [mode, mergeOptions, innerValue])

  const values = useMemo(() => {
    if (Array.isArray(current)) {
      return current.map((opt) => opt.title || opt.label?.toString())
    }
    return current ? current.title || current.label?.toString() : null
  }, [current])

  useImperativeHandle(ref, () => ({
    ...(inputRef.current || {}),
    values,
    fetchData,
  }))

  useEffect(() => {
    setLocalOptions(options || [])
  }, [options])

  useEffect(() => {
    const init = async () => {
      if (value != null && current == null && !initialed && remoteByValue) {
        const options = await remoteByValue(value, params)
        if (Array.isArray(options)) {
          setInitOptions(options)
        } else {
          setInitOptions([options])
        }
      }
      if (remote != null && !initialed) {
        await fetchData('')
      }
      setInitialed(true)
    }
    init()
  }, [current, initialed, fetchData, params, remote, remoteByValue, value])

  const handleChange = useCallback(
    (value: SelectValue, option: OptionReturnType) => {
      onChange && onChange(value, option)
    },
    [onChange]
  )
  const handleSearch = useCallback(
    (key: string) => {
      setOptionSearchKey(key)
      if (remote) {
        fetchData(key)
      }
    },
    [remote, fetchData, setOptionSearchKey]
  )

  const dropdownRender = useCallback(
    (menu: React.ReactElement) => {
      return optionSearch ? (
        <React.Fragment>
          <Input
            ref={searchRef}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<Search2Line />}
            bordered={false}
            value={optionSearchKey}
          />
          <Divider style={{ margin: '4px 0' }} />
          {menu}
        </React.Fragment>
      ) : (
        <React.Fragment>{menu}</React.Fragment>
      )
    },
    [handleSearch, optionSearch, optionSearchKey]
  )

  const handleOpen = useCallback(
    (open: boolean) => {
      if (!optionSearch) {
        return
      }
      if (open) {
        setTimeout(() => searchRef && searchRef.current.focus(), 300)
      } else {
        handleSearch('')
      }
    },
    [optionSearch, handleSearch]
  )

  const filterOption = (input: string, option?: OptionItem) => {
    return (
      (option?.title || option?.label?.toString() || '')
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    )
  }

  if (readMode) {
    if (itemRender) {
      if (Array.isArray(current)) {
        return (
          <React.Fragment>
            {current.map((opt) => {
              return itemRender(opt.value, opt.title || opt.label)
            })}
          </React.Fragment>
        )
      }
    }
    return <span>{Array.isArray(values) ? values.join(', ') : values}</span>
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const optGroup = useMemo(() => {
    return mergeOptions.map((option) =>
      option.children ? (
        <OptGroup key={option.value} label={option.label}>
          {option.children.map((child) => (
            <Option key={child.value} value={child.value}>
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
  }, [mergeOptions])

  return (
    <Select
      value={innerValue}
      onChange={debounce(handleChange, 500)}
      defaultValue={defaultValue}
      size={size}
      onSearch={handleSearch}
      loading={loading}
      placeholder={placeholder}
      ref={inputRef}
      // options={mergeOptions}
      mode={mode}
      dropdownRender={dropdownRender}
      onDropdownVisibleChange={handleOpen}
      showSearch={showSearch}
      filterOption={filterOption}
      {...otherProps}
    >
      {optGroup}
    </Select>
  )
}

export const SelectPro = React.forwardRef(SelectRF)
