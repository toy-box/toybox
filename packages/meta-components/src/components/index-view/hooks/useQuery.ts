import { useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import qs from 'qs'
import { IPageable } from '../types'

export interface QueryData {
  pageable?: IPageable
  params?: Toybox.MetaSchema.Types.ICompareOperation[]
}

export const useQuery = () => {
  const history = useHistory()
  const location = useLocation()

  const setQuery = (query: QueryData) =>
    history.replace(`${location.pathname}?${qs.stringify(query)}`)
  const query = useMemo(
    () => qs.parse(location.search.substr(1)),
    [location.search]
  )
  return [query, setQuery] as [QueryData, (query: QueryData) => void]
}
