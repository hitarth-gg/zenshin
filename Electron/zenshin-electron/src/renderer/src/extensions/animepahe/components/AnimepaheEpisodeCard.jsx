import { PlayIcon } from '@radix-ui/react-icons'
import { Skeleton } from '@radix-ui/themes'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { parseAnimepaheImage } from '../utils/parseAnimepaheImage'

function AnimepaheEpisodeCard({ data }) {
  const [imageIsLoading, setImageIsLoading] = useState(true)

  //2024-10-13 02:54:45
  const timeAgo = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true }).replace('about', '')
  }

  const {
    id,
    anime_id,
    anime_title,
    anime_session,
    episode,
    episode2,
    snapshot,
    session,
    created_at
  } = data
  return (
    <div
      // onClick={() => handleClick()}
      className="m-4 flex animate-fade cursor-pointer flex-col items-center justify-center gap-y-2 transition-all ease-in-out hover:scale-110"
    >
      <div className="h-42 relative aspect-video w-full">
        {snapshot ? (
          <div>
            <div className="absolute z-10 h-full w-full opacity-0 transition-all duration-150 ease-in-out hover:opacity-100">
              <PlayIcon className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#00000070] p-3 backdrop-blur-[2px]" />
            </div>
            <img
              src={parseAnimepaheImage(snapshot)}
              alt={`${anime_title}`}
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
          // e.stopPropagation()
          // navigate(`/anime/${anilistId}`)
        }}
      >
        <div className="w-full truncate text-sm font-medium opacity-90">{anime_title}</div>

        <div className="flex justify-between text-xs opacity-60">
          <p className="text-nowrap">{timeAgo(created_at)}</p>
          <p className="text-nowrap">Episode {episode}</p>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default AnimepaheEpisodeCard
