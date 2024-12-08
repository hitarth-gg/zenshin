import { useQuery } from "@tanstack/react-query";
import { getRecentActivity, getTopAnime } from "../utils/helper";

export default function useGetRecentGlobalActivity() {
  const {
    isLoading,
    data,
    error,
    status
  } = useQuery({
    queryKey: ["recent_activity"],
    queryFn: getRecentActivity,
    staleTime: 1000 * 60 * 10, // 10 min
  });

  return { isLoading, data, error, status };
}
