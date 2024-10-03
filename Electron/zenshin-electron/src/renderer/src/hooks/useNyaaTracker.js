import { useQuery } from "@tanstack/react-query";
import { searchTorrent } from "../utils/helper";

export default function useNyaaTracker(query) {
  const {
    isLoading,
    data: torrents,
    error,
    status,
  } = useQuery({
    queryKey: ["nyaa_episode_tracker", query],
    queryFn: () => {
      if (query) {
        return searchTorrent(query);
      }
      return null;
    },
    enabled: !!query, // Ensures the query only runs when the query string is not null
    staleTime: 1000 * 60 * 10, // 10 mins
  });

  // console.log("Query Status:", status); // Log to check if the query is running
  // console.log("Torrent Data:", torrents); // Log the returned data to see its structure

  return { isLoading, torrents, error, status };
}
