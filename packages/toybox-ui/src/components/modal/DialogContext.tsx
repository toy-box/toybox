import React from 'react'

export type DialogContextProps = {
  close: (...args: any[]) => void
}

export const DialogContext = React.createContext<DialogContextProps>(undefined)
