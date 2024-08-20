import { useQuery } from "@tanstack/react-query";
import { getAniZipMappings } from "../utils/helper";

export default function useGetAniZipMappings(id) {

  const {
    isLoading,
    data,
    error,
    status,
  } = useQuery({
    queryKey: ["cur_anime_anizip", id],
    queryFn: () => getAniZipMappings(id),
    staleTime: 1000 * 60 * 20, // 20 mins
  });

  return { isLoading, data, error, status };
}
