//getNewReleases
import { useQuery } from "@tanstack/react-query";
import { getNewReleases } from "../utils/helper";

export default function useGetNewReleases(packer = "[SubsPlease]") {
  const {
    isLoading,
    data,
    error,
    status
  } = useQuery({
    queryKey: ["new_releases", packer],
    queryFn: () => getNewReleases(packer),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { isLoading, data, error, status };
}
