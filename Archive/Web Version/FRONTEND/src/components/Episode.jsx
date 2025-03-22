import { format, set } from 'date-fns'
import useNyaaTracker from '../hooks/useNyaaTracker'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, DropdownMenu, Skeleton, Tooltip } from '@radix-ui/themes'
import {
  DiscIcon,
  DividerVerticalIcon,
  DownloadIcon,
  FileIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons'
import useGetoToshoEpisodes from '../hooks/useGetToshoEpisodes'
import nFormatter from '../utils/nFormatter'
import formatBytes from '../utils/formatBytes'
export default function Episode({
  data,
  anime,
  animeId,
  dualAudio,
  episodeNumber,
  all,
  bannerImage,
  setEpisodePage,
  episodePage,
  animeEpisodes
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

  // on pressing escape, close the dropdown
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') {
        setActive(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  function handleClick() {
    // e.stopPropagation()
    if (active) {
      setActive(false)
      return
    }
    setActive((prevActive) => !prevActive)
  }

  function onTorrentClick(torrent) {
    navigate(
      `/player/${encodeURIComponent(torrent.magnet_uri)}/${animeId}/${progress}/${episodeNumber}`
    )
  }

  useEffect(() => {
    if (dualAudio) {
      const temp = toshoEps?.filter((torrent) => {
        const title = torrent?.title

        // Ensure that the title exists and is a string before using toLowerCase
        if (typeof title === 'string') {
          const lowerCaseTitle = title.toLowerCase()
          return (
            lowerCaseTitle.includes('dual audio') ||
            lowerCaseTitle.includes('dual-audio') ||
            lowerCaseTitle.includes('english dub') ||
            lowerCaseTitle.includes('eng dub')
          )
        }
        return false
      })

      setTorrentData(temp)
    } else {
      setTorrentData(toshoEps)
    }
  }, [dualAudio, toshoEps])

  torrentData?.sort((a, b) => b.seeders - a.seeders)

  // check if the episode was released after the last 2 days
  const isRecent =
    data?.airdate &&
    (() => {
      const airDate = new Date(data.airdate) // Convert airdate to Date object
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2) // Set to two days ago

      return airDate > twoDaysAgo && airDate <= new Date() // Check if within the last two days
    })()

  const isUpcoming =
    data?.airdate &&
    (() => {
      const airDate = new Date(data.airdate)
      const today = new Date()
      // Normalize both dates to YYYY-MM-DD (ignoring time)
      airDate.setHours(0, 0, 0, 0) // Set airDate to the start of the day (00:00:00)
      today.setHours(0, 0, 0, 0)
      return airDate > today
    })()

  // if the data is undefined, then it is a filler episode or a recap episode ot a movie
  if (all)
    return (
      <div className='flex w-full'>
      {animeEpisodes?.length > 100?(
                <div className="flex items-start">
                  <DropdownMenu.Root className="nodrag" modal={false}>
                <DropdownMenu.Trigger>
                  <div className="flex m-1 h-14 items-center gap-2 cursor-default border border-gray-700 p-3 font-space-mono hover:bg-[#1e1e20]">
                    <div>{(episodePage*100)-99}-{(episodePage*100)}</div>
                    <DropdownMenu.TriggerIcon />
                  </div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {Array.from({length: Math.ceil(animeEpisodes.length/100)}, (_, i) => i+1).map((page) => (
                    <DropdownMenu.Item
                      color={`${episodePage === page ? 'indigo' : 'gray'}`}
                      onClick={() => setEpisodePage(page)}>
                      {(page*100)-99}-{(page*100)}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              </div>
        ):("")}
      <div
        onClick={() => handleClick()}
        className="relative m-1 w-full cursor-default border border-gray-700 p-3 font-space-mono transition-all duration-100 ease-in-out hover:bg-[#1e1e20]"
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

            {!isLoading && torrentData?.length === 0 && (
              <p className="font-space-mono text-red-500">No torrents found</p>
            )}

            {torrentData?.map((torrent) => (
              <div
                key={torrent.title}
                className="group flex animate-fade-down cursor-pointer flex-col gap-y-1 border-2 border-[#2c2d3c] bg-[#111113] px-2 py-2 transition-all duration-150 ease-in-out animate-duration-500 hover:border-[#c084fc90]" //0f1012
                onClick={() => onTorrentClick(torrent)}
              >
                <div className="mr-1 flex min-w-32 items-center gap-x-4 p-1">
                  <div className="flex items-center gap-x-1">
                    <p className="font-space-mono text-xs opacity-60">
                      {nFormatter(torrent.seeders)}
                    </p>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>

                  <div className="flex items-center gap-x-1">
                    <p className="font-space-mono text-xs opacity-60">
                      {nFormatter(torrent.leechers)}
                    </p>
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  </div>

                  <div className="flex items-center gap-x-1">
                    <p className="font-space-mono text-xs opacity-60">
                      {nFormatter(torrent.torrent_downloaded_count)}
                    </p>
                    <DownloadIcon height={12} width={12} color="gray" />
                  </div>

                  <div className="flex items-center gap-x-1">
                    <p className="text-nowrap font-space-mono text-xs opacity-60">
                      {torrent.num_files}
                    </p>
                    <FileIcon height={12} width={12} color="gray" />
                  </div>

                  <div className="flex items-center gap-x-1">
                    <p className="text-nowrap font-space-mono text-xs opacity-60">
                      {formatBytes(torrent.total_size, 1)}
                    </p>
                    <DiscIcon height={12} width={12} color="gray" />
                  </div>
                </div>
                <p className="cursor-pointer font-space-mono text-sm tracking-wide opacity-55 transition-all duration-150 ease-in-out group-hover:text-purple-400 group-hover:opacity-100">
                  {torrent.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    )

  // if the data is defined, then it is a normal episode
  if (episodeNumber <= progress && data?.hideWatchedEpisodes) return null
  return (
    <div className="flex w-full cursor-default flex-col border border-gray-700 font-space-mono transition-all duration-100 ease-in-out hover:bg-[#1e1e20] hover:opacity-100">
      <div className="flex">
        {data.thumbnail && (
          <img
            src={data.thumbnail}
            alt="episode_img"
            className="duration-400 mr-3 h-28 animate-fade object-cover transition-all ease-in-out hover:z-20 hover:scale-150 hover:rounded-md"
          />
        )}

        <div
          onClick={() => handleClick()}
          className={`h-full w-full cursor-default p-2 font-space-mono transition-all duration-100 ease-in-out hover:bg-[#1e1e20] hover:opacity-100`}
        >
          <div
            className={`flex h-full items-center justify-between ${isUpcoming ? 'opacity-25' : ''}`}
          >
            <div className="flex items-center gap-x-1 font-space-mono font-medium opacity-90">
              {/* <p className="text-lg">{episodeNumber}. </p> */}
              <div>
                <p className="flex items-center gap-2 font-space-mono text-lg font-medium opacity-100">
                  {episodeNumber <= progress && (
                    <Tooltip content="Watched">
                      <p className="h-2 min-h-2 w-2 min-w-2 rounded-full bg-green-500"></p>
                    </Tooltip>
                  )}
                  <p className="line-clamp-1">
                    {data.epNum}. {data.title}
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
            <div className="flex w-fit gap-x-2 text-xs">
              {/* <p className="">{data.filler ? "Filler" : "Not Filler"}</p> */}
              {/* <p>{data.recap ? "Recap" : "Not Recap"}</p> */}
              <div className="ml-4 h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
              {data.airdate && (
                <p
                  className={`text-nowrap ${isRecent ? 'text-purple-400 opacity-90' : 'opacity-50'}`}
                >
                  {format(new Date(data.airdate), 'dd MMM yyyy')}
                </p>
              )}
              {/* {isRecent && <div className="h-5 w-[1px] bg-[#333]"></div>} Divider */}
              <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
              {/* <p className="opacity-60">{data.score}</p> */}
            </div>
          </div>
        </div>
      </div>

      {active && (
        <div className="mx-3 my-3 flex flex-col gap-y-2">
          {isLoading && <Skeleton width={'50%'} className="mb-3" />}
          {error && <p className="font-space-mono text-red-500">Error fetching torrents</p>}
          {!isLoading && torrentData?.length === 0 && (
            <p className="font-space-mono text-red-500">No torrents found</p>
          )}
          {torrentData?.map((torrent) => (
            <div
              key={torrent.title}
              className="group flex animate-fade-down cursor-pointer flex-col gap-y-1 border-2 border-[#2c2d3c] bg-[#111113] px-2 py-2 transition-all duration-150 ease-in-out animate-duration-500 hover:border-[#c084fc90]" //0f1012
              onClick={() => onTorrentClick(torrent)}
            >
              <div className="mr-1 flex min-w-32 items-center gap-x-4 p-1">
                <div className="flex items-center gap-x-1">
                  <p className="font-space-mono text-xs opacity-60">
                    {nFormatter(torrent.seeders)}
                  </p>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>

                <div className="flex items-center gap-x-1">
                  <p className="font-space-mono text-xs opacity-60">
                    {nFormatter(torrent.leechers)}
                  </p>
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </div>

                <div className="flex items-center gap-x-1">
                  <p className="font-space-mono text-xs opacity-60">
                    {nFormatter(torrent.torrent_downloaded_count)}
                  </p>
                  <DownloadIcon height={12} width={12} color="gray" />
                </div>

                <div className="flex items-center gap-x-1">
                  <p className="text-nowrap font-space-mono text-xs opacity-60">
                    {torrent.num_files}
                  </p>
                  <FileIcon height={12} width={12} color="gray" />
                </div>

                <div className="flex items-center gap-x-1">
                  <p className="text-nowrap font-space-mono text-xs opacity-60">
                    {formatBytes(torrent.total_size, 1)}
                  </p>
                  <DiscIcon height={12} width={12} color="gray" />
                </div>
              </div>
              <p className="cursor-pointer font-space-mono text-sm tracking-wide opacity-55 transition-all duration-150 ease-in-out group-hover:text-purple-400 group-hover:opacity-100">
                {torrent.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
