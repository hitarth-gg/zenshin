import { useQuery } from '@tanstack/react-query'
import { animepaheEpisodes } from '../utils'

export default function useGetAnimePaheEps(id, page) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['animepahe_cur_anime_eps', id, page],
    queryFn: () => {
      if (id) return animepaheEpisodes(id, page)
      return null
    },
    staleTime: 1000 * 60 * 5 // 5 mins
  })

  return { isLoading, data, error, status }
}
