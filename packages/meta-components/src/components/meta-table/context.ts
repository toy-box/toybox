import React from 'react'
import { IColumnData } from './interface'

export type MetaColumnContextProps = IColumnData

export const MetaColumnContext =
  React.createContext<MetaColumnContextProps>(null)
