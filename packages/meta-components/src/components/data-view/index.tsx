import React, { createContext, useContext } from 'react'

export type DataViewProps = {
  schema: Toybox.MetaSchema.Types.IObjectMeta
  loadData: () => Promise<any>
  saveData: (data: any) => Promise<any>
}

export const DataViewContext = createContext<DataViewProps>(null)

export const useDataView = () => {
  return useContext(DataViewContext)
}

export const DataView: React.FC<DataViewProps> = ({
  schema,
  loadData,
  saveData,
  children,
}) => {
  return (
    <DataViewContext.Provider value={{ schema, loadData, saveData }}>
      {children}
    </DataViewContext.Provider>
  )
}
