/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-use-before-define */
import useRequest from '@ahooksjs/use-request'
import { useUpdateEffect, usePersistFn } from 'ahooks'
import { useCallback, useEffect } from 'react'
import {
  CombineService,
  PaginatedParams,
  BasePaginatedOptions,
  PaginatedOptionsWithFormat,
  PaginatedFormatReturn,
  PaginatedResult,
} from '@ahooksjs/use-request/lib/types'
import { CompareOP, LogicOP } from '@toy-box/meta-schema'

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
  searchActions: {
    submit: () => void
    reset: () => void
  }
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
    refreshDeps = [],
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

  useEffect(() => {
    run(pageable, params)
  }, [params, pageable])
  // 获取当前展示的 form 字段值
  // const fetcParams = useCallback(() => {
  //   if (logicFilter) {
  //     return {
  //       logic: LogicOP.AND,
  //       compares: paramsActions?.getPreParams().current,
  //     }
  //   }
  //   const compares = paramsActions?.getPreParams().current
  //   const newParams: Record<string, any> = {}
  //   if (compares) {
  //     compares.forEach((compare) => {
  //       if (
  //         compare.source &&
  //         compare.op === CompareOP.EQ &&
  //         compare.target &&
  //         compare.target !== ''
  //       ) {
  //         console.log('compare', compare)
  //         newParams[compare.source] = compare.target
  //       }
  //     })
  //   }
  //   return newParams
  // }, [paramsActions, logicFilter])

  // 首次加载，手动提交。为了拿到 form 的 initial values
  // useEffect(() => {
  //   // 如果有缓存，则使用缓存，重新请求
  //   if (params.length > 0) {
  //     run(...params)
  //     return
  //   }

  //   // 如果没有缓存，触发 submit
  //   if (!manual) {
  //     _submit(defaultParams)
  //   }
  // }, [])

  // const _submit = useCallback(
  //   (initParams?: any) => {
  //     setTimeout(() => {
  //       // const submitParams = fetcParams()
  //       const compares = paramsActions?.getPreParams().current || []
  //       paramsActions?.setParams(
  //         compares.filter(
  //           (compare) =>
  //             compare.source &&
  //             compare.op === CompareOP.EQ &&
  //             compare.target &&
  //             compare.target !== ''
  //         )
  //       )
  //       if (initParams) {
  //         run(initParams[0], compares)
  //         return
  //       }

  //       run(
  //         {
  //           pageSize: options.defaultPageSize || 10,
  //           ...((params[0] as PaginatedParams[0] | undefined) || {}), // 防止 manual 情况下，第一次触发 submit，此时没有 params[0]
  //           current: 1,
  //         },
  //         compares
  //       )
  //     })
  //   },
  //   [paramsActions, run, params]
  // )

  // const _reset = useCallback(() => {
  //   if (paramsActions) {
  //     paramsActions.setPreParams(undefined)
  //   }
  //   _submit()
  // }, [paramsActions, _submit])

  // refreshDeps 变化，reset。
  // useUpdateEffect(() => {
  //   if (!manual) {
  //     _reset()
  //   }
  // }, [...refreshDeps])

  // const submit = usePersistFn((e) => {
  //   if (e && e.preventDefault) {
  //     e.preventDefault()
  //   }
  //   _submit()
  // })

  // const reset = usePersistFn((e) => {
  //   if (e && e.preventDefault) {
  //     e.preventDefault()
  //   }
  //   _reset()
  // })

  return {
    ...result,
    // searchActions: {
    //   submit,
    //   reset,
    // },
  }
}

export const useTable = useAntdTable
