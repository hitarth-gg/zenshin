import { useQuery } from '@tanstack/react-query'
import { animepaheLatest } from '../extensions/animepahe/utils'

export default function useGetAnimepaheReleases(page) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['animepahe_releases', page],
    queryFn: () => {
      if (page) {
        return animepaheLatest(page)
      }
      return null
    },
    staleTime: 1000 * 60 * 3 // 3 minutes
  })

  return { isLoading, data, error, status }
}
