import { useQuery } from '@tanstack/react-query'
import { getToshoEpisodes } from '../utils/helper'

export default function useGetoToshoEpisodes(quality, aids, eids) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['tosho_episode_tracker', quality, aids, eids],
    queryFn: () => {
      if (quality && aids) {
        return getToshoEpisodes(quality, aids, eids)
      }
      return null
    },
    enabled: !!(quality && aids), // Ensures the query only runs when the query string is not null
    staleTime: 1000 * 60 * 10 // 10 mins
  })

  console.log('Query Status:', aids, eids) // Log to check if the query is running
  // console.log("Torrent Data:", torrents); // Log the returned data to see its structure

  return { isLoading, data, error, status }
}
