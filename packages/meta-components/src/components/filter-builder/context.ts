import React, { createContext } from 'react'
import { IspecialOption, OpTypeProps, IoperatOption } from './interface'

export interface IFilterBuilderContextProps {
  value: Partial<Toybox.MetaSchema.Types.ICompareOperation>[]
  onChange: (
    value: Partial<Toybox.MetaSchema.Types.ICompareOperation>[]
  ) => void
  specialMode?: boolean
  specialOptions?: IspecialOption[]
  simple?: boolean
  operatType?: OpTypeProps
  customValueElement?: React.ReactElement
}

export const FilterBuilderContext = createContext<IFilterBuilderContextProps>({
  value: [],
  onChange: () => undefined,
})
