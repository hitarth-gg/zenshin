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
    staleTime: 0,
  });

  return { isLoading, animeData, error, status };
}