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

export interface IoperatOption {
  type: Toybox.MetaSchema.Types.CompareOP | string
  children: IspecialOption[]
}

export enum OpTypeEnum {
  INSERT = 'insert',
  REPLACE = 'replace',
}

export type OpTypeProps = OpTypeEnum.INSERT | OpTypeEnum.REPLACE

export type IUncheckCompare = Partial<Toybox.MetaSchema.Types.ICompareOperation>
