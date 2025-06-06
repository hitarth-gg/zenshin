import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
// import VideoJS, { PlyrPlayer } from './VideoJs'
// import videojs from 'video.js'
import StreamStats from '../components/StreamStats'
import { Button } from '@radix-ui/themes'
import { toast } from 'sonner'
import { ExclamationTriangleIcon, LightningBoltIcon, TrashIcon } from '@radix-ui/react-icons'
import EpisodesPlayer from '../components/EpisodesPlayer'
import StreamStatsEpisode from '../components/StreamStatsEpisode'
import 'plyr-react/plyr.css'
import Plyr from 'plyr-react'
import { useZenshinContext } from '../utils/ContextProvider'

export default function Player(query) {
  const magnetURI = useParams().magnetId
  const ref = useRef(null)

  const [videoSrc, setVideoSrc] = useState('')
  const [subtitleSrc, setSubtitleSrc] = useState('')
  const [files, setFiles] = useState([])
  const { vlcPath, backendPort } = useZenshinContext()
  // receive params from navigation hook
  const loc = useLocation()
  const { episodeTitle, episodeNumber, animeTitle, bannerImage, discordRpcActivity } =
    loc.state.state
  console.log(loc.state)

  function setDiscordRPC() {
    if (!discordRpcActivity) return
    window.api.setDiscordRpc({
      ...discordRpcActivity,
      state: `Episode ${episodeNumber}: ${episodeTitle}`
    })
  }

  useEffect(() => {
    setDiscordRPC()
    return () => {
      window.api.setDiscordRpc({ details: 'Browsing Anime' })
    }
  }, [discordRpcActivity])

  const handleKeyDown = (event) => {
    if (ref.current && ref.current.plyr) {
      const player = ref.current.plyr
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault() // Prevent default browser behavior (scrolling)
          player.currentTime = Math.max(player.currentTime - 5, 0) // Seek backward 5 seconds
          break
        case 'ArrowRight':
          event.preventDefault() // Prevent default browser behavior
          player.currentTime = Math.min(player.currentTime + 5, player.duration) // Seek forward 5 seconds
          break
        default:
          break
      }
    }
  }

  // Attach event listener to the entire window

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [videoSrc])

  // console.log(magnetURI);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Step 1: Add the torrent
      const response = await axios.get(
        `http://localhost:${backendPort}/add/${encodeURIComponent(magnetURI)}`
      )
      console.log(response)
      // Step 2: Set the video source for streaming
      setVideoSrc(`http://localhost:${backendPort}/stream/${encodeURIComponent(magnetURI)}`)
      // Step 3: Set the subtitle source
      setSubtitleSrc(`http://localhost:${backendPort}/subtitles/${encodeURIComponent(magnetURI)}`)
    } catch (error) {
      console.error('Error adding the torrent or streaming video', error)

      toast.error('Error streaming video', {
        duration: 5000,
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        description:
          "Couldn't stream the video, make sure the torrent is valid and the Backend Server is running.",
        classNames: {
          title: 'text-rose-500'
        }
      })
    }
  }

  const getFiles = async () => {
    let temp_obj = {
      streamUrl: null,
      ...loc.state
    }
    window.api.saveToSettings('currentAnime', temp_obj)

    try {
      console.log('Inside getFiles')

      const response = await axios.get(
        `http://localhost:${backendPort}/metadata/${encodeURIComponent(magnetURI)}`
      )
      console.log('magnetURI: ' + magnetURI)

      console.log(response)
      const data = await response.data
      setFiles(data)
      console.log('files: ' + data)
    } catch (error) {
      toast.error('Backend is not running on your local machine', {
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        description:
          'Backend is not running on your local machine or NO files were found in the torrent',
        classNames: {
          title: 'text-rose-500'
        }
      })

      console.error('Error getting torrent details', error)
    }
  }

  const handleVlcStream = async () => {
    try {
      await axios.get(`http://localhost:${backendPort}/add/${encodeURIComponent(magnetURI)}`)

      // Send a request to the server to open VLC with the video stream URL
      await axios.get(
        `http://localhost:${backendPort}/stream-to-vlc?url=${encodeURIComponent(
          `http://localhost:${backendPort}/stream/${encodeURIComponent(magnetURI)}`
        )}`
      )
    } catch (error) {
      console.error('Error streaming to VLC', error)
      toast.error('Error streaming to VLC', {
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        description:
          'Make sure that VLC is installed on your system and correct path is set to it in BACKEND/server.js and the Backend Server is running.',
        classNames: {
          title: 'text-rose-500'
        }
      })
    }
  }
  // log current path
  console.log('Current path:', window.location.pathname)

  const checkBackendRunning = async () => {
    try {
      const response = await axios.get(`http://localhost:${backendPort}/ping`)
      console.log(response)

      if (response.status === 200) {
        toast.success('Backend is running', {
          icon: <LightningBoltIcon height="16" width="16" color="#ffffff" />,
          description: 'Backend is running on your local machine',
          classNames: {
            title: 'text-green-500'
          }
        })
      }
    } catch (error) {
      toast.error('Backend is not running', {
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        description: 'Backend is not running on your local machine',
        classNames: {
          title: 'text-rose-500'
        }
      })

      console.error('Error checking if the backend is running', error)
    }
  }

  /* ------------------------------------------------------ */

  /* ---------------- Handling batch files ---------------- */

  const handleStreamBrowser = (episode) => {
    // save the data in the settings
    let temp_obj = {
      episodeName: episode,
      streamUrl: `http://localhost:${backendPort}/streamfile/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`,
      ...loc.state
    }
    console.log(temp_obj);

    window.api.saveToSettings('currentAnime', temp_obj)

    setVideoSrc(
      `http://localhost:${backendPort}/streamfile/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`
    )
  }
  console.log(videoSrc)

  const playerRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState('')

  const plyrProps = {
    source: {
      type: 'video',
      sources: [
        {
          src: videoSrc,
          type: 'video/webm'
        }
      ],
      autoplay: true
    }
  }


  const handleStreamVlc = async (episode) => {
    // save the data in the settings
    let temp_obj = {
      episodeName: episode,
      streamUrl: `http://localhost:${backendPort}/streamfile/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`,
      ...loc.state
    }
    window.api.saveToSettings('currentAnime', temp_obj)

    try {
      window.api.openVlc(
        `${vlcPath} http://localhost:${backendPort}/streamfile/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`
      )
    } catch (error) {
      console.error('Error streaming to VLC', error)
      toast.error('Error streaming to VLC', {
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        description:
          'Make sure that VLC is installed on your system and correct path is set to it in BACKEND/server.js and the Backend Server is running.',
        classNames: {
          title: 'text-rose-500'
        }
      })
    }
  }

  const stopEpisodeDownload2 = async (episode) => {
    try {
      // Send a DELETE request to remove the torrent
      console.log(
        `http://localhost:${backendPort}/deselect/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`
      )

      await axios.get(
        `http://localhost:${backendPort}/deselect/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`
      )

      // Clear the video and subtitle sources
      setCurrentEpisode('')
      setVideoSrc('')
      setSubtitleSrc('')

      // Dispose of the player if it's active
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }

      toast.success('Torrent removed successfully', {
        icon: <TrashIcon height="16" width="16" color="#ffffff" />,
        description: 'Episode download stopped successfully',
        classNames: {
          title: 'text-green-500'
        }
      })
    } catch (error) {
      console.error("Couldn't stop episode download", error)

      toast.error("Couldn't stop episode download", {
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        description:
          'You can manually stop it by restarting the server or by removing the torrent completely.',
        classNames: {
          title: 'text-rose-500'
        }
      })
    }
  }

  // for some reason, calling this function twice works, WebTorrent's file.deselect() is known to be buggy
  const stopEpisodeDownload = async (episode) => {
    await stopEpisodeDownload2(episode)
    await stopEpisodeDownload2(episode)
  }

  /* ------------------------------------------------------ */
  const handleRemoveTorrent = async () => {
    try {
      // Send a DELETE request to remove the torrent
      await axios.delete(`http://localhost:${backendPort}/remove/${encodeURIComponent(magnetURI)}`)

      // Clear the video and subtitle sources
      setVideoSrc('')
      setCurrentEpisode('')
      setSubtitleSrc('')
      setFiles([])

      // Dispose of the player if it's active
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }

      toast.success('Torrent removed successfully', {
        icon: <TrashIcon height="16" width="16" color="#ffffff" />,
        description: 'The torrent has been removed successfully',
        classNames: {
          title: 'text-green-500'
        }
      })
    } catch (error) {
      console.error('Error removing the torrent', error)

      toast.error('Error removing the torrent', {
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        description:
          "Couldn't remove the torrent, you can manually remove it by restarting the server.",
        classNames: {
          title: 'text-rose-500'
        }
      })
    }
  }

  return (
    <div className="mb-32 flex items-center justify-center px-8 font-space-mono">
      <div className="w-full">
        {videoSrc && (
          <div className="flex w-full justify-center">
            <div className="mx-0 aspect-video w-4/6 lg2:mx-32">
              <Plyr {...plyrProps} ref={ref} />
            </div>
          </div>
        )}

        {/* We basiically do this to prevent video player re-render */}
        {currentEpisode && (
          <StreamStatsEpisode
            magnetURI={magnetURI}
            episode={currentEpisode}
            stopEpisodeDownload={stopEpisodeDownload}
            setCurrentEpisode={setCurrentEpisode}
            currentEpisode={currentEpisode}
            handleStreamVlc={handleStreamVlc}
            setVideoSrc={setVideoSrc}
          />
        )}

        <div className="fixed-width border border-gray-700 bg-[#1d1d20] p-4">
          <StreamStats magnetURI={magnetURI} />

          <div className="mt-5 flex gap-x-3">
            <Button onClick={getFiles} size="1" color="blue" variant="soft" type="submit">
              Get Files
            </Button>
            <Button size="1" color="red" variant="soft" onClick={handleRemoveTorrent}>
              Stop and Remove Anime
            </Button>
            <Button size="1" color="green" variant="soft" onClick={checkBackendRunning}>
              Ping Backend
            </Button>
          </div>
        </div>
        {files && (
          <div className="mt-8">
            {files.map((file) => (
              <EpisodesPlayer
                key={file.name}
                file={file}
                handleStreamBrowser={handleStreamBrowser}
                handleStreamVlc={handleStreamVlc}
                stopEpisodeDownload={stopEpisodeDownload}
                setCurrentEpisode={setCurrentEpisode}
              />
            ))}{' '}
          </div>
        )}
      </div>
    </div>
  )
}
