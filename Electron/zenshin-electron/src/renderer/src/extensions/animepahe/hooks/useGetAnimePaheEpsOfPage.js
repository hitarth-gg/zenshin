import { useQuery } from '@tanstack/react-query'
import { animepaheEpisodesOfPage } from '../utils'

export default function useGetAnimePaheEpsOfPage(id, page) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['animepahe_cur_anime_eps_of_page', id, page],
    queryFn: () => {
      if (id) return animepaheEpisodesOfPage(id, page)
      return null
    },
    staleTime: 1000 * 60 * 3 // mins
  })

  return { isLoading, data, error, status }
}
