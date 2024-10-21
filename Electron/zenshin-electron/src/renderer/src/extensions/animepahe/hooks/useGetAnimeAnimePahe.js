import { useQuery } from '@tanstack/react-query'
import { animepaheDetails } from '../utils'

export default function useGetAnimeAnimePahe(id) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['animepahe_cur_anime', id],
    queryFn: () => {
      if (id) return animepaheDetails(id)
      return null
    },
    staleTime: 1000 * 60 * 5 // 5 mins
  })

  return { isLoading, data, error, status }
}
