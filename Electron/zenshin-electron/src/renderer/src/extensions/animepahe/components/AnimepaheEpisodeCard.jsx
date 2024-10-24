import { PlayIcon } from '@radix-ui/react-icons'
import { Skeleton } from '@radix-ui/themes'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { parseAnimepaheImage } from '../utils/parseAnimepaheImage'
import { useNavigate } from 'react-router-dom'

function AnimepaheEpisodeCard({ data }) {
  const [imageIsLoading, setImageIsLoading] = useState(true)

  //2024-10-13 02:54:45
  const timeAgo = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true }).replace('about', '')
  }

  const navigate = useNavigate()

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
      className="m-4 flex animate-fade cursor-pointer flex-col items-center justify-center gap-y-2 font-space-mono transition-all ease-in-out hover:scale-110"
    >
      <div
        className="h-42 relative aspect-video w-full"
        onClick={() => navigate(`/animepahe/anime/${anime_session}`)}
      >
        {snapshot ? (
          <div>
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
        className="flex w-full flex-col gap-y-1 transition-all duration-150 ease-in-out"
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/animepahe/anime/${anime_session}`)
        }}
      >
        <div className="w-full truncate text-sm font-medium opacity-90">{anime_title}</div>

        <div className="flex justify-between text-xs opacity-60">
          <p className="text-nowrap">{timeAgo(created_at)}</p>
          <p className="text-nowrap">Episode {episode}</p>
        </div>
      </div>
    </div>
  )
}

export default AnimepaheEpisodeCard
