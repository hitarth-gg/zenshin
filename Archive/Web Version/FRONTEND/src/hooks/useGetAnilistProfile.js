import { useQuery } from "@tanstack/react-query";
import { getAnilistProfile } from "../utils/auth";

export default function useGetAnilistProfile(token) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ["cur_profile"],
    queryFn: () => {
      if (token) return getAnilistProfile(token);
      return null;
    },
    staleTime: 1000 * 60 * 20, // 20 mins
  });

  return { isLoading, data, error, status };
}
