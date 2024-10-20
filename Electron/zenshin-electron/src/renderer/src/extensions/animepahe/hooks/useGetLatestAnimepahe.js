import { useQuery } from '@tanstack/react-query'

export default function useGetLatestAnimepahe(page) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['cur_anime_mal', page],
    queryFn: () => {
      if (page) return useGetLatestAnimepahe(page)
      return null
    },
    staleTime: 1000 * 60 * 20 // 20 mins
  })

  return { isLoading, data, error, status }
}
