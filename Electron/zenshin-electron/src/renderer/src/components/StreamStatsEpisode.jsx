import { Button } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { setWatchedEpisodes } from '../utils/helper'
import { useZenshinContext } from '../utils/ContextProvider'

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default function StreamStatsEpisode({
  magnetURI,
  episode,
  stopEpisodeDownload,
  setCurrentEpisode,
  currentEpisode,
  handleStreamVlc,
  setVideoSrc
}) {
  const [details, setDetails] = useState(null)
  const animeId = useParams().animeId || null
  const priorProgress = useParams().priorProgress || null
  const currentEpisodeNum = useParams().currentEpisodeNum || null
  const [mountTime, setMountTime] = useState(Date.now())

  const [episodeUpdated, setEpisodeUpdated] = useState(false)

  const { autoUpdateAnilistEpisode } = useZenshinContext()

  useEffect(() => {
    const fetchDetails = () => {
      fetch(
        `http://localhost:64621/detailsepisode/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`
      )
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
  }, [episode, magnetURI])

  console.log('details', details?.percentageWatched)

  useEffect(() => {
    const elapsedTime = Date.now() - mountTime

    if (
      elapsedTime > 5000 && // Check if more than 5 seconds have passed
      !episodeUpdated &&
      details?.percentageWatched > 80 &&
      details?.percentageWatched < 98 &&
      currentEpisodeNum > priorProgress &&
      animeId &&
      currentEpisodeNum &&
      priorProgress &&
      autoUpdateAnilistEpisode
    ) {
      setEpisodeUpdated(true)
      if (!localStorage.getItem('anilist_token')) return
      try {
        setWatchedEpisodes(animeId, currentEpisodeNum, priorProgress) // Update watched episodes on AniList, see helper.js
        toast('Episode updated on AniList!', { type: 'success' })
      } catch (error) {
        console.error('Error updating episode on AniList:', error)
        toast('Error updating episode on AniList!', { type: 'error' })
      }
    }
  }, [details, episodeUpdated, currentEpisodeNum, priorProgress, animeId, mountTime])

  return (
    <div className="mb-10 mt-3 flex flex-col items-center gap-y-1 border-b border-gray-700 pb-3 font-space-mono">
      <div className="text-blue-400">{details?.name}</div>
      <div className="">
        <div className="mt-3 flex justify-center gap-x-20">
          <p className="opacity-45">
            <strong>Size:</strong> {formatBytes(details?.length)}
          </p>
          <p className="opacity-45">
            <strong>Downloaded:</strong> {formatBytes(details?.downloaded)}
          </p>
          <p className="opacity-45">
            <strong>Progress:</strong> {(details?.progress * 100)?.toFixed(2)}%
          </p>
          <Button
            size="1"
            color="red"
            variant="soft"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentEpisode('')
              stopEpisodeDownload(episode)
            }}
          >
            Stop downloading the episode
          </Button>
          <Button
            size="1"
            color="orange"
            variant="soft"
            onClick={(e) => {
              e.stopPropagation()
              handleStreamVlc(episode)
            }}
          >
            Open VLC
          </Button>
        </div>
      </div>
    </div>
  )
}
