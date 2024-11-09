import { useQuery } from '@tanstack/react-query'
import { searchAnilist } from '../utils/helper'
import { isObjectEmpty } from '../utils/objectEmpty'

export default function useGetAnilistSearch(searchObject, page = 1) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['anilist_search', searchObject, page],
    queryFn: () => {
      if (!isObjectEmpty(searchObject)) return searchAnilist(searchObject, page)
      return null
    },
    staleTime: 1000 * 60 * 20 // 20 mins
  })

  return { isLoading, data, error, status }
}
