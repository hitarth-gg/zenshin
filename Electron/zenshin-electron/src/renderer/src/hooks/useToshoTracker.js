import { useQuery } from '@tanstack/react-query'
import { searchTorrentOnTosho } from '../utils/helper'
import { collectAnimeToshoPages } from '../utils/episodeCatalog.mjs'

export default function useToshoTracker(query, maxPages = 1) {
  const {
    isLoading,
    data: torrents,
    error,
    status,
    isFetching
  } = useQuery({
    queryKey: ['tosho_search_result_tracker', query, maxPages],
    queryFn: () => {
      if (query) {
        return collectAnimeToshoPages((page) => searchTorrentOnTosho(query, page), {
          maxPages,
          pageSize: 100
        })
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
