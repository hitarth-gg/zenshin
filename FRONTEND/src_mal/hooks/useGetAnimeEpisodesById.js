import { useQuery } from "@tanstack/react-query";
import { getAnimeById, getAnimeEpisodesById } from "../utils/helper";

export default function useGetAnimeEpisodesById(id) {
  console.log("Fetching anime with id:", id);

  const {
    isLoading,
    data: animeEpisodes,
    error,
    status,
  } = useQuery({
    queryKey: ["cur_anime_episodes", id],
    queryFn: () => getAnimeEpisodesById(id),
    staleTime: 0,
    
  });

  return { isLoading, animeEpisodes, error, status };
}
