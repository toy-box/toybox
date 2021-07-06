import { SimpleTreeNode } from '../meta-fields/interface'

export interface IFieldService {
  findOptions?: (
    key: string,
    name: string
  ) => Promise<Toybox.MetaSchema.Types.IFieldOption[]>
  findOfValues?: (
    key: string,
    value: (string | number)[]
  ) => Promise<Toybox.MetaSchema.Types.IFieldOption[]>
  findDataTrees?: (
    key: string,
    parentId: string | number
  ) => Promise<SimpleTreeNode[]>
}

export interface IspecialOption {
  value: string
  label: string
}

export type IUncheckCompare = Partial<Toybox.MetaSchema.Types.ICompareOperation>
