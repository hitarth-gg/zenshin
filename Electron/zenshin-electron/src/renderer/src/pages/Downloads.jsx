import { useEffect, useRef, useState } from 'react'
import formatBytes from '../utils/formatBytes'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import nFormatter from '../utils/nFormatter'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from '@radix-ui/themes'

function Downloads() {
  const [message, setMessage] = useState([])
  const [statusWs, setStatus] = useState('Disconnected')

  useEffect(() => {
    // Create a new WebSocket connection
    // const socket = new WebSocket('ws://localhost:64622')
    const socket = new WebSocket('ws://localhost:64621/ws')

    // Handle WebSocket events
    socket.onopen = () => {
      console.log('WebSocket connected')
      setStatus('Connected')
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // console.log('Received data:', data)
      setMessage(data)
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
      setStatus('Disconnected')
    }

    // Cleanup the WebSocket on unmount
    return () => {
      socket.close()
    }
  }, [])

  let clientDownloadSpeed = message[0]?.clientDownloadSpeed || 0
  let clientUploadSpeed = message[0]?.clientUploadSpeed || 0
  // remove first element from array and store rest in rem
  let rem = message.slice(1)
  console.log(rem)

  const [settings, setSettings] = useState({})
  const settingsRef = useRef(null)

  useEffect(() => {
    if (settingsRef.current === null) {
      console.log('Fetching settings')

      window.api
        .getSettingsJson()
        .then((data) => {
          setSettings(data)
          settingsRef.current = data // Cache the data
        })
        .catch((error) => console.error(error))
    } else {
      setSettings(settingsRef.current)
    }
  }, [])

  let anime = settings?.currentAnime?.state || null
  let currAnime = settings?.currentAnime || null
  if (
    !settings?.currentAnime?.episodeName ||
    settings?.currentAnime?.episodeName !== rem[0]?.name
  ) {
    anime = null
    currAnime = null
  }
  const navigate = useNavigate()
  console.log(anime)

  return (
    <div className="mx-9 mt-8 font-space-mono tracking-wide">
      <div className="mb-2 border-b border-gray-700 pb-1 font-space-mono text-lg font-bold tracking-wider">
        Downloads
      </div>

      {rem.map((e, index) => (
        <div
          key={index}
          className="relative my-3 flex h-40 animate-fade-up select-none flex-col justify-center rounded-sm bg-[#21242650]"
        >
          <div className="flex h-full w-full flex-row">
            {anime && (
              <Tooltip content={'Go to anime page.'}>
                <div className="h-full w-fit" onClick={() => navigate(`/anime/${anime?.animeId}`)}>
                  <img
                    src={anime?.animeCoverImage}
                    alt=""
                    className="duration-400 z-10 h-full w-fit animate-fade cursor-pointer rounded-sm object-cover transition-all ease-in-out"
                  />
                </div>
              </Tooltip>
            )}
            {anime && (
              <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
                <img
                  src={anime?.bannerImage}
                  alt=""
                  className="top-7 z-0 h-72 w-full border-2 object-cover opacity-20 blur-sm saturate-150 2xl:h-96"
                />
              </div>
            )}
            <Tooltip
              content={currAnime ? 'Go to player.' : 'Only metadata is available for this anime.'}
            >
              <div
                className="flex w-full cursor-pointer flex-col justify-center px-4 py-2"
                onClick={() => {
                  console.log('Anime:', currAnime.pathname)

                  if (currAnime) navigate(currAnime.pathname, { state: currAnime })
                  else console.log('Anime not found')
                }}
              >
                {anime && (
                  <p className="mb-2 line-clamp-2 py-1 text-[1.5rem] text-base tracking-tight">
                    {anime?.animeTitle}
                  </p>
                )}
                <p className="line-clamp-2 text-base tracking-tight">{e.name}</p>
                {/* <div className="my-2 ml-1 flex gap-x-4"> */}
                <div className="my-2 ml-1 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-x-4 gap-y-2">
                  <p className="flex w-40 items-center justify-start gap-x-2 text-sm">
                    {formatBytes(e.downloadSpeed)}/s
                    <ArrowDownIcon />
                  </p>
                  <p className="flex w-40 items-center justify-start gap-x-2 text-sm">
                    {formatBytes(e.uploadSpeed)}/s
                    <ArrowUpIcon />
                  </p>
                  <p className="flex w-48 items-center justify-start gap-x-2 text-sm">
                    {(e.progress * 100).toFixed(2)}% Completed
                  </p>
                  <p className="flex w-48 items-center justify-start gap-x-2 text-sm">
                    {formatBytes(e.downloaded)} Downloaded
                  </p>
                  <p className="flex w-48 items-center justify-start gap-x-2 text-sm">
                    {formatBytes(e.uploaded)} Uploaded
                  </p>
                </div>
                <div className="downloadProgressBar h-1 w-full bg-gray-600">
                  {/* <div className="progress border" style={{ width: `${e.progress * 100}%` }}> */}
                  <div
                    className="progress h-1 bg-blue-500"
                    style={{ width: `${e.progress * 100}%` }}
                  >
                    {/* <div className="progressText">{e.progress * 100}%</div> */}
                  </div>
                </div>
              </div>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Downloads
