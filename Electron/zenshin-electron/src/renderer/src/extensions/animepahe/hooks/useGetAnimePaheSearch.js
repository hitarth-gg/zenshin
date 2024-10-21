import { useQuery } from '@tanstack/react-query'
import { animepaheSearch } from '../utils'

export default function useGetAnimePaheSearch(query) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['animepahe_search', query],
    queryFn: () => {
      if (query) return animepaheSearch(query)
      return null
    },
    staleTime: 1000 * 60 * 2 // 2 mins
  })

  return { isLoading, data, error, status }
}
