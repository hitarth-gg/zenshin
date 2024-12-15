import { useEffect, useState } from 'react'
import formatBytes from '../utils/formatBytes'
import { useZenshinContext } from '../utils/ContextProvider'

export default function StreamStats({ magnetURI }) {
  const [details, setDetails] = useState(null)
  const { backendPort } = useZenshinContext()
  useEffect(() => {
    const fetchDetails = () => {
      fetch(`http://localhost:${backendPort}/details/${encodeURIComponent(magnetURI)}`)
        .then((response) => response.json())
        .then((data) => setDetails(data))
        .catch((error) => console.error('Error fetching torrent details:', error))
    }

    // Fetch details immediately
    fetchDetails()

    // Set interval to fetch details every 1 second
    const intervalId = setInterval(fetchDetails, 1000)

    // Clear interval on component unmount
    return () => clearInterval(intervalId)
  }, [magnetURI])

  return (
    <div className="mt-2 flex flex-col gap-y-1 font-space-mono">
      <div className="text-cyan-200">{details?.name}</div>
      <div className="opacity-45">
        <div className="grid grid-flow-row grid-cols-3">
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
        <div className="grid grid-flow-row grid-cols-2 lg:grid-cols-3 overflow-hidden text-sm">
          {/* <div className="relative grid grid-flow-col-dense grid-cols-3 gap-x-12 overflow-hidden border text-sm"> */}
          <p className="flex gap-x-2">
            <p className="text-nowrap">Download Speed: </p>{' '}
            <p className="min-w-56">{formatBytes(details?.downloadSpeed)} /sec</p>
          </p>
          <p className="flex gap-x-2">
            <p className="text-nowrap">Upload Speed:</p>
            <p className="min-w-56">{formatBytes(details?.uploadSpeed)} /sec</p>
          </p>
          <p className="flex gap-x-2">
            <p className="text-nowrap">Progress:</p>
            <p className="min-w-56">{(details?.progress * 100)?.toFixed(2)}%</p>
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
  )
}
