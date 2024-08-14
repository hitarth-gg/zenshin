import { useQuery } from "@tanstack/react-query";
import { getTopAiringAnime } from "../utils/helper";

export default function useTopAiringAnime() {
  const {
    isLoading,
    data: topAiringAnime,
    error,
    status
  } = useQuery({
    queryKey: ["top_airing_anime"],
    queryFn: getTopAiringAnime,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { isLoading, topAiringAnime, error, status };
}
