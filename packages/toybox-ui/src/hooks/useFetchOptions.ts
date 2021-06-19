import { useState, useCallback } from 'react'
import { OptionData, OptionGroupData } from '../components/types/interface'

declare type OptionsType = (OptionData | OptionGroupData)[]

export const useFetchOptions = (
  loadData: (key: string, params?: any) => Promise<OptionsType>,
  params?: any
) => {
  const [options, setOptions] = useState<OptionsType>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = useCallback(
    async (key: string) => {
      setLoading(true)
      setOptions(await loadData(key, params))
      setLoading(false)
    },
    [loadData, params]
  )

  return [loading, options, fetchData] as [
    boolean,
    OptionsType,
    (key: string, params?: any) => Promise<void>
  ]
}
