import { useQuery } from '@tanstack/react-query'
import { getAniZipMappings } from '../utils/helper'

export default function useGetAniZipMappings(id, anidb = false) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['cur_anime_anizip', id],
    queryFn: () => {
      if (id) return getAniZipMappings(id, anidb)
      return null
    },
    staleTime: 1000 * 60 * 5 // 5 mins
  })

  return { isLoading, data, error, status }
}
