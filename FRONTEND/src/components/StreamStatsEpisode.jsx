import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export default function StreamStatsEpisode({
  magnetURI,
  episode,
  stopEpisodeDownload,
  setCurrentEpisode,
  currentEpisode,
}) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = () => {
      fetch(
        `http://localhost:8000/detailsepisode/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`,
      )
        .then((response) => response.json())
        .then((data) => setDetails(data))
        .catch((error) =>
          console.error("Error fetching torrent details:", error),
        );
    };

    // Fetch details immediately
    fetchDetails();

    // Set interval to fetch details every 1 second
    const intervalId = setInterval(fetchDetails, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [episode, magnetURI]);

  return (
    <div className="mb-10 mt-2 flex flex-col gap-y-1 border-b border-gray-700 pb-3 font-space-mono">
      <div className="text-blue-400">{details?.name}</div>
      <div className="opacity-45">
        <div className="flex justify-between">
          <p>
            <strong>Size:</strong> {formatBytes(details?.length)}
          </p>
          <p>
            <strong>Downloaded:</strong> {formatBytes(details?.downloaded)}
          </p>
          <p>
            <strong>Progress:</strong> {(details?.progress * 100)?.toFixed(2)}%
          </p>
          <p className="">
            <Button
              size="1"
              color="red"
              variant="soft"
              onClick={(e) => {
                e.stopPropagation();
                stopEpisodeDownload(currentEpisode);
                setCurrentEpisode("");
              }}
            >
              Stop downloading the episode
            </Button>
          </p>
          <div className="flex gap-x-16 text-sm"></div>
        </div>
      </div>
    </div>
  );
}
