import { Skeleton } from '@radix-ui/themes'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CurrentlyWatchingCard({ data }) {
  const [imageIsLoading, setImageIsLoading] = useState(true)
  const navigate = useNavigate()

  console.log(data)

  return (
    <div className="mx-auto"
      onClick={
        () => navigate(`/anime/${data?.id}`)
      }
    >
      <div className="m-4 flex aspect-[10/5] w-fit animate-fade cursor-pointer flex-col items-center justify-center gap-y-2 font-space-mono">
        <div className="h-42 relative aspect-[10/5] overflow-hidden transition-all ease-in-out hover:scale-110">
          <div className="relative flex aspect-[10/5] h-full">
            {imageIsLoading && (
              <Skeleton className="duration-400 absolute flex-grow rounded-sm transition-all ease-in-out" />
            )}
            <img
              src={data?.coverImage?.extraLarge || data?.coverImage?.medium}
              alt=""
              className="duration-400 z-10 w-44 animate-fade rounded-sm object-cover transition-all ease-in-out"
            />
            <div className="relative">
              <div className="absolute z-10 w-full px-2 py-1 tracking-wider">
                <div className="line-clamp-1">
                  {data?.title?.romaji} • {data?.title?.native}
                </div>
                <div className="line-clamp-1 w-full border-b border-[#ffffff50] pb-1 text-sm opacity-80">
                  {data?.title?.english}
                </div>
                <div className="line-clamp-1 w-full border-b border-[#ffffff50] py-1 text-sm opacity-80">
                  Episode: {data?.mediaListEntry?.progress} / {data?.episodes || '?'}
                </div>
              </div>
              <img
                src={data?.bannerImage || data?.coverImage?.extraLarge}
                className="duration-400 aspect-[10/5] h-full w-max scale-105 animate-fade overflow-hidden rounded-sm object-cover blur-sm brightness-[0.2] transition-all ease-in-out"
                onLoad={() => setImageIsLoading(false)}
                onError={() => setImageIsLoading(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentlyWatchingCard
