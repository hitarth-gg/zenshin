import { useQuery } from '@tanstack/react-query'
import { searchTorrentOnTosho } from '../utils/helper'

export default function useToshoTracker(query) {
  const {
    isLoading,
    data: torrents,
    error,
    status,
    isFetching
  } = useQuery({
    queryKey: ['tosho_search_result_tracker', query],
    queryFn: () => {
      if (query) {
        return searchTorrentOnTosho(query)
      }
      return null
    },
    enabled: !!query, // Ensures the query only runs when the query string is not null
    staleTime: 1000 * 60 * 10 // 10 mins
  })

  // console.log("Query Status:", status); // Log to check if the query is running
  // console.log("Torrent Data:", torrents); // Log the returned data to see its structure

  return { isLoading, torrents, error, status, isFetching }
}
