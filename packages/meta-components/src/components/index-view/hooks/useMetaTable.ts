import useAntdTable, { Obj, IResponse, Options } from '@ahooksjs/antd-table'
import { IPageResult } from '../types'

export const useMetaTable = (
  service: (params: Obj) => Promise<IPageResult>,
  options?: Options | undefined
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

  return useAntdTable(doService, options)
}
