import React, { createContext, FC } from 'react'
import { IspecialOption, OpTypeProps, IoperatOption } from './interface'

export interface IFilterBuilderContextProps {
  value: Partial<Toybox.MetaSchema.Types.ICompareOperation>[]
  onChange: (
    value: Partial<Toybox.MetaSchema.Types.ICompareOperation>[],
    index: number
  ) => void
  specialMode?: boolean
  specialOptions?: IspecialOption[]
  simple?: boolean
  operatType?: OpTypeProps
  customValueElement?: FC
  customValueProps?: any
}

export const FilterBuilderContext = createContext<IFilterBuilderContextProps>({
  value: [],
  onChange: () => undefined,
})
