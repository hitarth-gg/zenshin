import { useNavigate } from 'react-router-dom'
import {
  parseISO,
  differenceInMinutes,
  differenceInSeconds,
  differenceInHours,
  getUnixTime,
  formatDistanceToNow
} from 'date-fns'
import { useEffect, useState } from 'react'
import { searchAiringAnime } from '../utils/helper'
import useGetAniZipMappings from '../hooks/useGetAniZipMappings'
import { Skeleton } from '@radix-ui/themes'
import { toast } from 'sonner'
import { PlayIcon } from '@radix-ui/react-icons'

function magnetRegex(magnet) {
  const magnetRegex = /<a href="([^"]*)">Magnet<\/a>/i
  let magnetRegex2 = /<a href="(magnet:[^"]*)">Magnet<\/a>/i
  const match1 = magnet?.match(magnetRegex)
  const match2 = match1[0]?.match(magnetRegex2)
  const match3 = match2[0]?.split('"')[1]
  return match3 || ''
}

const tempImg =
  'https://artworks.thetvdb.com/banners/v4/episode/10166490/screencap/6685897a8dc6c.jpg'

function timeAgo(dateString) {
  // Parse the date string
  const pastDate = new Date(dateString)
  const now = new Date()
  // Calculate differences
  const minutesAgo = differenceInMinutes(now, pastDate)
  const secondsAgo = differenceInSeconds(now, pastDate)
  const hoursAgo = differenceInHours(now, pastDate)

  // Format the output
  let result = `${secondsAgo} seconds ago`
  if (minutesAgo >= 1) {
    result = `${minutesAgo} minutes ago`
  }
  if (hoursAgo >= 1) {
    result = `${hoursAgo} hours ago`
  }
  return result
}

export default function NewReleaseCard({
  data,
  cardErrorShown,
  setCardErrorShown,
  anilistIds,
  setAnilistIds,
  dataAnilist,
  totalCards,
  setTotalCards
}) {
  const navigate = useNavigate()
  // const magnet = magnetRegex(data?.description[0]) || ''
  const magnet = data.magnet_uri

  // console.log(data)

  function handleClick() {
    navigate(`/player/${encodeURIComponent(magnet)}`)
  }
  const filename = data?.title
  const [anilistData, setAnilistData] = useState(null)

  let title = filename.slice(filename.indexOf(']') + 1, filename.lastIndexOf('-') - 1)
  let episode = Number(filename.slice(filename.lastIndexOf('-') + 2, filename.indexOf('(') - 1))

  const [anilistId, setAnilistId] = useState(null)

  const [imageUrl, setImageUrl] = useState(null)

  const aniDbId = data?.anidb_aid

  // async function getImageUrl() {
  //   // https://api.ani.zip/mappings?anidb_id=1
  //   const data = await fetch(`https://api.ani.zip/mappings?anidb_id=${aniDbId}`)
  //   const json = await data.json()
  // }
  const { isLoading, error, data: anidbMap } = useGetAniZipMappings(aniDbId, true)
  const timeAgo = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true }).replace('about', '')
  }
  // console.log(anidbMap)

  useEffect(() => {
    if (anidbMap) {
      // conver the object into an array
      setAnilistId(anidbMap.mappings.anilist_id)
      const arr = anidbMap?.episodes ? Object.values(anidbMap.episodes) : []
      const img = arr.filter((ep) => ep.anidbEid == data.anidb_eid)
      console.log(img)

      setAnilistIds((prev) => [...prev, anidbMap.mappings.anilist_id])
      if (!img[0]?.image) {
        setImageUrl(tempImg)
      }
      setImageUrl(img[0]?.image)
    } else {
      console.log('AnidbMap is null')
      setTotalCards(totalCards - 1)
    }
  }, [anidbMap])
  const [episodeNumber, setEpisodeNumber] = useState(0)
  // get anilist cover image
  const [anilistCover, setAnilistCover] = useState(null)

  useEffect(() => {
    if (dataAnilist && anilistId) {
      const arr = dataAnilist?.data ? Object.values(dataAnilist.data) : []
      const anilistData = arr.filter((data) => data.id === anilistId)
      const cover = anilistData[0]?.coverImage?.extraLarge
      setAnilistCover(cover)
      console.log(arr)
    }
  }, [dataAnilist, anilistId])

  console.log(anilistCover)

  const [imgIsLoading, setImageIsLoading] = useState(true)

  return (
    <div
      onClick={() => handleClick()}
      className="m-4 flex animate-fade cursor-pointer flex-col items-center justify-center gap-y-2 font-space-mono transition-all ease-in-out hover:scale-110"
    >
      <div className="h-42 relative aspect-video w-full">
        {imageUrl || anilistCover ? (
          <div>
            <div className="absolute z-10 h-full w-full opacity-0 transition-all duration-150 ease-in-out hover:opacity-100">
              <PlayIcon className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#00000070] p-3 backdrop-blur-[2px]" />
            </div>
            <img
              src={imageUrl || anilistCover}
              alt="episode_image"
              className="duration-400 h-42 aspect-video w-96 animate-fade rounded-sm object-cover object-center transition-all ease-in-out"
              onLoad={() => setImageIsLoading(false)}
              onError={() => setImageIsLoading(false)}
            />
          </div>
        ) : (
          <Skeleton className="duration-400 aspect-video h-full flex-grow rounded-sm transition-all ease-in-out" />
        )}
      </div>
      <div
        className="flex w-full flex-col gap-y-1 transition-all duration-150 ease-in-out hover:text-purple-400"
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/anime/${anilistId}`)
        }}
      >
        <div className="w-full truncate text-sm font-medium opacity-90">{title}</div>

        <div className="flex justify-between text-xs opacity-60">
          <p className="text-nowrap">{timeAgo(data.timestamp)}</p>
          <p className="text-nowrap">Episode {episode}</p>
        </div>
        <div></div>
      </div>
    </div>
  )
}
