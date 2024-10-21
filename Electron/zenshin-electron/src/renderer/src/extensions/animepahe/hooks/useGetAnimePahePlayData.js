import { useQuery } from '@tanstack/react-query'
import { animepahePlay } from '../utils'

export default function useGetAnimePaheEps(id, epid) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['animepahe_play', id, epid],
    queryFn: () => {
      if (id && epid) return animepahePlay(id, epid)
      return null
    },
    staleTime: 1000 * 60 * 5 // 5 mins
  })

  return { isLoading, data, error, status }
}
