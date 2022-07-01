import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import qs from 'qs'

export interface QueryData {
  pageable?: {
    current?: string
    pageSize?: string
  }
  params?: string
}

export const useQuery = () => {
  const history = useNavigate()
  const location = useLocation()

  const setQuery = (query: any) => {
    history(`${location.pathname}?${qs.stringify(query)}`, { replace: true })
  }

  const query = useMemo(
    () => qs.parse(location.search.substr(1)),
    [location.search]
  )
  return [query, setQuery] as [QueryData, (query: any) => void]
}
