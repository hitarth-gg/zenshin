import { useQuery } from "@tanstack/react-query";
import { getTopAnime } from "../utils/helper";

export default function useTopAiringAnime() {
  const {
    isLoading,
    data: topAnime,
    error,
    status
  } = useQuery({
    queryKey: ["top_anime"],
    queryFn: getTopAnime,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { isLoading, topAnime, error, status };
}
