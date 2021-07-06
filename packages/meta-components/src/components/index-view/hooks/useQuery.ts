import { useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import qs from 'qs'

export interface QueryData {
  pageable?: {
    current?: string
    pageSize?: string
  }
  params?: string
}

export const useQuery = () => {
  const history = useHistory()
  const location = useLocation()

  const setQuery = (query: any) =>
    history.replace(`${location.pathname}?${qs.stringify(query)}`)
  const query = useMemo(
    () => qs.parse(location.search.substr(1)),
    [location.search]
  )
  return [query, setQuery] as [QueryData, (query: any) => void]
}
