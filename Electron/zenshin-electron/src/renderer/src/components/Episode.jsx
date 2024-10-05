import { format } from 'date-fns'
import useNyaaTracker from '../hooks/useNyaaTracker'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Skeleton, Tooltip } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import useGetoToshoEpisodes from '../hooks/useGetToshoEpisodes'

export default function Episode({
  data,
  anime,
  animeId,
  englishDub,
  episodeNumber,
  all
  // aniZip_titles,
  // bannerImage
}) {
  console.log(data)

  const navigate = useNavigate()
  const [active, setActive] = useState(false)
  const progress = data?.progress || 0
  const [torrentData, setTorrentData] = useState([])
  const {
    isLoading,
    data: toshoEps,
    error
  } = useGetoToshoEpisodes(active ? data?.quality : null, data?.aids, data?.eids ? data.eids : null)

  useEffect(() => {
    if (toshoEps) {
      setTorrentData(toshoEps)
    }
  }, [toshoEps])

  // sort the torrents by seeders
  torrentData.sort((a, b) => b.seeders - a.seeders)

  function handleClick() {
    if (active) {
      setActive(false)
      return
    }
    setActive((prevActive) => !prevActive)
  }

  function onTorrentClick(torrent) {
    navigate(
      `/player/${encodeURIComponent(torrent.magnet)}/${animeId}/${progress}/${episodeNumber}`
    )
  }

  // if the data is undefined, then it is a filler episode or a recap episode ot a movie
  if (all)
    return (
      <div
        onClick={() => handleClick()}
        className="relative m-1 cursor-default border border-gray-700 p-3 font-space-mono transition-all duration-100 ease-in-out hover:bg-[#1e1e20]"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-x-1 font-space-mono font-medium opacity-90">
            <div>
              <p className="flex gap-x-2 font-space-mono text-lg font-medium opacity-90">
                <span className="flex items-center gap-2 text-gray-400">
                  All <MagnifyingGlassIcon />
                </span>
                | {anime.romaji}
              </p>
            </div>
          </div>
        </div>
        {active && (
          <div className="mt-3 flex flex-col gap-y-2">
            {isLoading && <Skeleton width={'50%'} />}
            {error && <p className="font-space-mono text-red-500">Error fetching torrents</p>}

            {!isLoading && torrentData.length === 0 && (
              <p className="font-space-mono text-red-500">No torrents found</p>
            )}

            {torrentData?.map((torrent) => (
              <div
                className="flex animate-fade-down items-center animate-duration-500"
                key={torrent.title}
              >
                <div className="flex min-w-20 items-center gap-x-1 border border-gray-800 p-1">
                  <p className="font-space-mono text-xs opacity-60">{torrent.seeders}</p>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="font-space-mono text-xs opacity-60">{torrent.leechers}</p>
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </div>
                <p
                  key={torrent.title}
                  onClick={() => onTorrentClick(torrent)}
                  className="cursor-pointer font-space-mono text-sm tracking-wide opacity-55 hover:text-purple-400 hover:opacity-85"
                >
                  {torrent.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    )

  // if the data is defined, then it is a normal episode
  if (episodeNumber <= progress && data?.hideWatchedEpisodes) return null
  return (
    <div
      onClick={() => handleClick()}
      className={`m-1 w-full cursor-default border border-gray-700 p-2 font-space-mono transition-all duration-100 ease-in-out hover:bg-[#1e1e20] hover:opacity-100`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1 font-space-mono font-medium opacity-90">
          {data.thumbnail && (
            <img
              src={data.thumbnail}
              alt="episode_img"
              className="duration-400 mr-3 h-24 animate-fade object-cover transition-all ease-in-out hover:z-20 hover:scale-150 hover:rounded-md"
            />
          )}
          {/* <p className="text-lg">{episodeNumber}. </p> */}
          <div>
            <p className="flex items-center gap-2 font-space-mono text-lg font-medium opacity-100">
              {episodeNumber <= progress && (
                <Tooltip content="Watched">
                  <p className="h-2 min-h-2 w-2 min-w-2 rounded-full bg-green-500"></p>
                </Tooltip>
              )}
              <p className="line-clamp-1">
                {episodeNumber}. {data.title}
              </p>
            </p>
            {data.overview && (
              // <Tooltip content={data.overview}>
              <p className="line-clamp-3 font-space-mono text-sm font-medium opacity-60">
                {data.overview}
              </p>
              // </Tooltip>
            )}
          </div>
        </div>
        <div className="flex w-fit gap-x-2 text-xs opacity-60">
          {/* <p className="">{data.filler ? "Filler" : "Not Filler"}</p> */}
          {/* <p>{data.recap ? "Recap" : "Not Recap"}</p> */}
          <div className="ml-4 h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
          {data.airdate && (
            <p className="text-nowrap opacity-60">
              {format(new Date(data.airdate), 'dd MMMM yyyy')}
            </p>
          )}
          <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
          {/* <p className="opacity-60">{data.score}</p> */}
        </div>
      </div>
      {active && (
        <div className="mt-3 flex flex-col gap-y-2">
          {isLoading && <Skeleton width={'50%'} />}
          {error && <p className="font-space-mono text-red-500">Error fetching torrents</p>}
          {!isLoading && torrentData.length === 0 && (
            <p className="font-space-mono text-red-500">No torrents found</p>
          )}
          {torrentData?.map((torrent) => (
            <div
              key={torrent.title}
              className="flex animate-fade-down items-center animate-duration-500"
            >
              <div className="flex min-w-20 items-center gap-x-1 border border-gray-800 p-1">
                <p className="font-space-mono text-xs opacity-60">{torrent.seeders}</p>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p className="font-space-mono text-xs opacity-60">{torrent.leechers}</p>
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
              </div>
              <p
                onClick={() => onTorrentClick(torrent)}
                className="cursor-pointer font-space-mono text-sm tracking-wide opacity-55 hover:text-purple-400 hover:opacity-85"
              >
                {torrent.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
