import { useQuery } from "@tanstack/react-query";
import { getAnimeById } from "../utils/helper";

export default function useGetAnimeById(id) {
  console.log("Fetching anime with id:", id);

  const {
    isLoading,
    data: animeData,
    error,
    status,
  } = useQuery({
    queryKey: ["cur_anime", id],
    queryFn: () => getAnimeById(id),
    staleTime: 1000 * 60 * 20, // 20 mins
  });

  return { isLoading, animeData, error, status };
}
