import { useEffect, useState } from "react";

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export default function StreamStats({ magnetURI }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = () => {
      fetch(`http://localhost:64621/details/${encodeURIComponent(magnetURI)}`)
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
  }, [magnetURI]);

  return (
    <div className="flex flex-col gap-y-1 font-space-mono mt-2">
      <div className="text-cyan-200">{details?.name}</div>
      <div className="opacity-45">
        <div className="flex gap-x-32">
          <p>
            <strong>Size:</strong> {formatBytes(details?.length)}
          </p>
          <p>
            <strong>Downloaded:</strong> {formatBytes(details?.downloaded)}
          </p>
          <p>
            <strong>Uploaded:</strong> {formatBytes(details?.uploaded)}
          </p>
        </div>
        <div className="flex gap-x-16 text-sm">
          <p className="flex text-nowrap">
            <strong>Download Speed: </strong>{" "}
            {formatBytes(details?.downloadSpeed)} /sec
          </p>
          <p>
            <strong>Upload Speed:</strong> {formatBytes(details?.uploadSpeed)}{" "}
            /sec
          </p>
          <p>
            <strong>Progress:</strong> {(details?.progress * 100)?.toFixed(2)}%
          </p>
        </div>
        <div className="flex gap-x-16 text-sm">
          <p>
            <strong>Ratio:</strong> {details?.ratio?.toFixed(2)}
          </p>
          <p>
            <strong>Peers:</strong> {details?.numPeers}
          </p>
        </div>
      </div>
    </div>
  );
}
