import useTable, {
  methods,
  Obj,
  IResponse,
  Options,
  IReturnValue,
} from '@ahooksjs/use-table'
import { PaginationProps } from 'antd'
import { useAntdPlugin } from './useAntdPlugin'
import { useFilterBuilderPlugin } from './useFilterBuilderPlugin'
import { IPageResult } from '../types'

export interface IUseMetaTableReturn
  extends Omit<IReturnValue, 'paginationProps'> {
  paginationProps?: PaginationProps
}

export interface IOptions extends Options {
  pagination?: {
    defaultCurrent?: number
    defaultPageSize?: number
    hideOnSinglePage?: boolean
    pageSizeOptions?: number[]
  }
}

export const useMetaTable = (
  service: (params: Obj) => Promise<IPageResult>,
  options?: IOptions | undefined
) => {
  const doService = async (params: Obj) => {
    const result = await service(params)
    return {
      success: true,
      data: {
        dataSource: result.list,
        total: result.total,
        current: result.current,
        pageSize: result.pageSize,
      },
    }
  }

  const plugins = options?.plugins || []
  const antdPlugin = useAntdPlugin()
  const filterBuilderPlugin = useFilterBuilderPlugin()
  return useTable(doService, {
    ...options,
    plugins: [...plugins, antdPlugin, filterBuilderPlugin],
  }) as IUseMetaTableReturn
}
