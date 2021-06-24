import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  Ref,
} from 'react'
import { TreeSelectProps, TreeSelect as AntTreeSelect } from 'antd'
import { LabeledValue as AntLabeledValue } from 'antd/lib/select'
import {
  LegacyDataNode,
  ChangeEventExtra,
  RawValueType,
} from 'rc-tree-select/lib/interface'
import { isArr } from '@toy-box/toybox-shared'
import { makeArray } from '@toy-box/toybox-shared'
import { BaseFieldProps, SimpleTreeNode } from '../interface'

export interface LabeledValue extends AntLabeledValue {
  disabled?: boolean
}

export declare type LabeledValueType = LabeledValue | LabeledValue[]
export declare type DefaultValueType = RawValueType | RawValueType[]

export interface IFieldTreeSelectProps<ValueType = DefaultValueType>
  extends Omit<BaseFieldProps, 'value' | 'onChange' | 'onClick'>,
    Omit<
      TreeSelectProps<ValueType>,
      | 'loadData'
      | 'mode'
      | 'onChange'
      | 'onSelect'
      | 'onDeselect'
      | 'treeDataSimpleMode'
    > {
  loadData: (id?: RawValueType) => Promise<SimpleTreeNode[]>
  loadByValue: (ids: RawValueType[]) => Promise<LabeledValue[]>
  onChange: (value?: ValueType) => void
  onSelect?: (value: LabeledValueType, node: any) => void
  onDeselect?: (value: LabeledValueType, node: any) => void
  treeData?: SimpleTreeNode[]
}

export const FieldTreeSelect = React.forwardRef(
  (
    {
      loadData,
      loadByValue,
      onChange,
      onSelect,
      onDeselect,
      mode,
      treeData,
      value,
      multiple,
      defaultValue,
      ...otherProps
    }: IFieldTreeSelectProps,
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
    const [initialized, setInitialized] = useState(false)
    const [realTreeData, setRealTreeData] = useState(treeData)
    const [labelValueCache, setLabelValueCache] = useState<LabeledValue[]>([])

    useEffect(() => {
      if (!initialized) {
        if (value) {
          console.log('loadByValue', loadByValue)
          loadByValue(isArr(value) ? value : [value]).then((data) => {
            setLabelValueCache(data)
            setInitialized(true)
          })
        }
      }
    }, [initialized, labelValueCache, loadByValue, value])

    const addNodes = useCallback(
      (nodes: SimpleTreeNode[]) => {
        setRealTreeData([...(realTreeData || []), ...nodes])
      },
      [realTreeData]
    )

    useEffect(() => {
      if (realTreeData == null || realTreeData.length === 0) {
        loadData().then((data) => {
          if (data.length > 0) {
            addNodes(data)
          }
        })
      }
    }, [realTreeData, loadData, addNodes])

    const innerValue = useMemo(() => {
      if (value == null) {
        return undefined
      }
      if (Array.isArray(value)) {
        return value.map(
          (v) =>
            labelValueCache.find((c) => c.value === v) ||
            ({ value: v, label: v } as LabeledValue)
        )
      }
      return labelValueCache.find((c) => c.value === value)
    }, [value, labelValueCache])

    const onLoadData = useCallback(
      async (node: LegacyDataNode) => {
        const nodes = await loadData(node.id)
        const newNodes = nodes.filter(
          (d) => !(realTreeData || []).some((rd) => rd.id === d.id)
        )
        if (newNodes.length > 0) {
          addNodes(newNodes)
        }
      },
      [loadData, addNodes, realTreeData]
    )

    const handleChange = useCallback(
      (
        value: LabeledValueType,
        labelList: React.ReactNode[],
        extra: ChangeEventExtra
      ) => {
        if (value == null) {
          return onChange(undefined)
        }
        if (Array.isArray(value)) {
          const unCached = value.filter(
            (v) => !labelValueCache.some((c) => c.value === v.value)
          )
          setLabelValueCache(labelValueCache.concat(...unCached))
          return onChange(value.map((v) => v.value))
        } else if (value != null) {
          if (!labelValueCache.some((c) => c.value === value.value)) {
            setLabelValueCache(labelValueCache.concat(value))
          }
          return onChange(value.value)
        }
      },
      [labelValueCache, onChange]
    )
    if (mode === 'read') {
      return (
        <span>
          {makeArray(innerValue || [])
            .map((i: LabeledValue) => i.label)
            .join(', ')}
        </span>
      )
    }
    return (
      <AntTreeSelect
        {...otherProps}
        ref={inputRef}
        treeDataSimpleMode
        value={innerValue}
        treeCheckable={multiple}
        labelInValue
        multiple={multiple}
        onChange={handleChange}
        treeData={realTreeData}
        showSearch={false}
        loadData={onLoadData}
      />
    )
  }
)

FieldTreeSelect.displayName = 'FieldTreeSelect'
