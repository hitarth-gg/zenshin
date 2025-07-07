import { useState, useEffect } from 'react'
import useNyaaTracker from '../hooks/useNyaaTracker'
import { Code, Spinner, TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import useToshoTracker from '../hooks/useToshoTracker'
import { useNavigate } from 'react-router-dom'

function CustomSearch({
  anime,
  animeId,
  data,
  progress,
  episodeNumber,
  bannerImage,
  animeCoverImage
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const { isFetching, torrents, error, status } = useToshoTracker(debouncedQuery)
  const [showResultsBox, setShowResultsBox] = useState(false)
  const navigate = useNavigate()
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Show/hide results based on query and torrents
  useEffect(() => {
    setShowResults(debouncedQuery.length > 0 && torrents && torrents.length > 0)
  }, [debouncedQuery, torrents])

  console.log(torrents)

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  function onTorrentClick(torrent) {
    console.log('torrent clicked:', torrent)

    let urlObj = {
      pathname: `/player/${encodeURIComponent(torrent.magnet_uri)}/${animeId}/${progress}/${episodeNumber}`,
      state: {
        animeId: animeId,
        magnetUri: torrent.magnet_uri,
        episodeTitle: data.title,
        episodeNumber: episodeNumber,
        animeTitle: anime.romaji,
        bannerImage: bannerImage,
        animeCoverImage: animeCoverImage
      }
    }
    navigate(urlObj.pathname, { state: urlObj })
  }

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col items-start justify-center">
      <div className="w-64">
        <TextField.Root
          placeholder={'Manually search for anime...'}
          className="nodrag w-full"
          style={{
            backgroundColor: '#212225',
            height: '25px',
            boxShadow: 'none',
            borderRadius: '3px',
            border: '0px',
            fontSize: '13px'
          }}
          onChange={handleSearchChange}
          type="text"
          value={searchQuery}
          onFocus={() => setShowResultsBox(true)}
          onBlur={(e) => {
            // Delay hiding to allow click events to fire
            setTimeout(() => setShowResultsBox(false), 150)
          }}
        >
          <TextField.Slot style={{ paddingLeft: '12px' }}>
            <MagnifyingGlassIcon height="16" width="16" color="#9ca3af" />
          </TextField.Slot>
        </TextField.Root>
      </div>

      {/* Results Dropdown */}
      {showResultsBox && searchQuery && (
        <div
          data-lenis-prevent="true"
          className="shadow-xl absolute top-full z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-sm border border-[#545454] bg-[#111113] drop-shadow-4xl"
        >
          {isFetching ? (
            <div className="flex items-center justify-center gap-x-2 p-4 text-center text-[#848486]">
              <Spinner className="" /> Searching...
            </div>
          ) : torrents && torrents.length > 0 ? (
            <div className="">
              {torrents.slice(0, 75).map((torrent) => (
                <div
                  key={torrent.id}
                  className="cursor-pointer border-b border-[#3a3b3f] px-4 py-3 transition-colors duration-150 last:border-b-0 hover:bg-[#1e1e20]"
                  onMouseDown={() => onTorrentClick(torrent)}
                >
                  <div className="flex flex-col space-y-2">
                    <div
                      className="line-clamp-2 font-space-mono text-[13px] font-medium leading-tight text-gray-400"
                      title={torrent.title}
                    >
                      {torrent.title}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                          {torrent.seeders} seeders
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1 h-2 w-2 rounded-full bg-red-500"></span>
                          {torrent.leechers} leechers
                        </span>
                        <span className="text-blue-400">
                          {torrent.torrent_downloaded_count} downloads
                        </span>
                      </div>
                      <span className="font-medium text-gray-300">
                        {formatFileSize(torrent.total_size)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            searchQuery &&
            !isFetching && <div className="p-4 text-center text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default CustomSearch
