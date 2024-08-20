import { useQuery } from "@tanstack/react-query";
import { getAnimeByMalId } from "../utils/helper";

export default function useGetAnimeByMalId(id) {
  console.log("Fetching anime with id:", id);

  const { isLoading, data, error, status } = useQuery({
    queryKey: ["cur_anime_mal", id],
    queryFn: () => {
      if (id) return getAnimeByMalId(id);
      return null;
    },
    staleTime: 1000 * 60 * 20, // 20 mins
  });

  return { isLoading, data, error, status };
}
