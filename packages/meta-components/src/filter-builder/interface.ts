import { SimpleTreeNode } from '../meta-fields/interface'

export interface FieldService {
  findOptions: (
    key: string,
    name: string
  ) => Promise<Toybox.MetaSchema.Types.IFieldOption[]>
  findOfValues: (
    key: string,
    value: (string | number)[]
  ) => Promise<Toybox.MetaSchema.Types.IFieldOption[]>
  findDataTrees: (
    key: string,
    parentId: string | number
  ) => Promise<SimpleTreeNode[]>
}

export type IUncheckCompare = Partial<Toybox.MetaSchema.Types.ICompareOperation>
