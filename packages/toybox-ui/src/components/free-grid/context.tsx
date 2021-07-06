import { createContext } from 'react'

export interface IFreeGridContext {
  removeItem?: (key: string) => void
}

export const FreeGridContext = createContext<IFreeGridContext>({
  removeItem: (key: string) => undefined,
})
