/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-use-before-define */
import useRequest from '@ahooksjs/use-request'
import { useCallback, useEffect } from 'react'
import {
  CombineService,
  PaginatedParams,
  BasePaginatedOptions,
  PaginatedOptionsWithFormat,
  PaginatedFormatReturn,
  PaginatedResult,
} from '@ahooksjs/use-request/lib/types'

export {
  CombineService,
  PaginatedParams,
  BasePaginatedOptions,
  PaginatedOptionsWithFormat,
  PaginatedFormatReturn,
  PaginatedResult,
}

export interface Store {
  [name: string]: any
}

type Antd4ValidateFields = (fieldNames?: string[]) => Promise<any>

export interface UseAntdTableFormUtils {
  getFieldInstance?: (name: string) => {} // antd 3
  setFieldsValue: (value: Toybox.MetaSchema.Types.ILogicFilter) => void
  getFieldsValue: (...args: any) => Toybox.MetaSchema.Types.ILogicFilter
  resetFields: (...args: any) => void
  validateFields: Antd4ValidateFields
  [key: string]: any
}

export interface IParamsActions {
  getParams: (...args: any) => any | undefined
  setParams: (params: any) => void
  getPreParams: (...args: any) => any | undefined
  setPreParams: (params: any) => void
}

export interface Result<Item> extends PaginatedResult<Item> {
  reload: () => void
}

export interface BaseOptions<U>
  extends Omit<BasePaginatedOptions<U>, 'paginated'> {
  paramsActions?: IParamsActions
  logicFilter?: boolean
}

export interface OptionsWithFormat<R, Item, U>
  extends Omit<PaginatedOptionsWithFormat<R, Item, U>, 'paginated'> {
  paramsActions?: IParamsActions
  logicFilter?: boolean
}

function useAntdTable<R = any, Item = any, U extends Item = any>(
  service: CombineService<R, PaginatedParams>,
  options: OptionsWithFormat<R, Item, U>,
  pageable?: any,
  params?: any
): Result<Item>
function useAntdTable<R = any, Item = any, U extends Item = any>(
  service: CombineService<PaginatedFormatReturn<Item>, PaginatedParams>,
  options: BaseOptions<U>,
  pageable?: any,
  params?: any
): Result<Item>
function useAntdTable<R = any, Item = any, U extends Item = any>(
  service: CombineService<any, any>,
  options: BaseOptions<U> | OptionsWithFormat<R, Item, U>,
  pageable?: any,
  params?: any
): any {
  const {
    logicFilter,
    paramsActions,
    refreshDeps = [params],
    manual,
    defaultParams,
    ...restOptions
  } = options
  const result = useRequest(service, {
    ...restOptions,
    paginated: true,
    manual: true,
  })

  const { run } = result

  const reload = useCallback(() => {
    run(pageable, params, true)
  }, [pageable, params])

  useEffect(() => {
    run(pageable, params)
  }, [params, pageable])

  return {
    ...result,
    reload,
  }
}

export const useTable = useAntdTable
