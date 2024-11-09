import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import '../index.css'
import { useZenshinContext } from '../utils/ContextProvider'
import { Skeleton, Tooltip } from '@radix-ui/themes'
import { useState } from 'react'

export default function AnimeCard({ data }) {
  // console.log(data);
  const navigate = useNavigate()

  function handleClick() {
    navigate(`/anime/${data.id}`, { state: { data } })
  }

  const [imageLoading, setImageLoading] = useState(true)

  const zenshinContext = useZenshinContext()
  const { glow } = zenshinContext

  const date = data?.startDate?.year
    ? new Date(data.startDate.year, data.startDate.month - 1, data.startDate.day)
    : null

  const status = data?.mediaListEntry?.status

  return (
    <div
      onClick={() => handleClick()}
      className="group relative mt-6 flex w-48 animate-fade cursor-pointer flex-col items-center justify-center gap-y-2 transition-all ease-in-out hover:scale-110"
    >
      <div className="relative z-10">
        {imageLoading && (
          <Skeleton className="duration-400 absolute top-0 z-10 h-60 w-[10.6rem] animate-fade rounded-sm object-cover transition-all ease-in-out"></Skeleton>
        )}

        <img
          src={data?.coverImage?.extraLarge}
          alt=""
          className={`duration-400 z-10 h-60 w-[10.6rem] animate-fade rounded-sm object-cover transition-all ease-in-out ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoading(false)}
        />
      </div>

      <div className="z-20 flex w-[85%] flex-col gap-y-1">
        <div
          title={data?.title?.romaji}
          className=" line-clamp-2 h-11 w-full text-sm font-medium opacity-90"
        >
          {data?.title?.romaji}
        </div>

        <div className="flex justify-between text-xs">
          <div className="flex items-center gap-x-2">
            <p className="text-nowrap opacity-60">{date && format(new Date(date), 'MMMM yyyy')}</p>

            {status === 'CURRENT' && (
              <Tooltip content="Watching">
                <p className="h-2 w-2 rounded-full bg-blue-500"></p>
              </Tooltip>
            )}
            {status === 'PLANNING' && (
              <Tooltip content="Planning to watch">
                <p className="h-2 w-2 rounded-full bg-gray-400"></p>
              </Tooltip>
            )}
            {status === 'COMPLETED' && (
              <Tooltip content="Completed">
                <p className="h-2 w-2 rounded-full bg-green-500"></p>
              </Tooltip>
            )}
            {status === 'DROPPED' && (
              <Tooltip content="Dropped">
                <p className="h-2 w-2 rounded-full bg-red-700"></p>
              </Tooltip>
            )}
            {status === 'PAUSED' && (
              <Tooltip content="Paused">
                <p className="h-2 w-2 rounded-full bg-orange-500"></p>
              </Tooltip>
            )}
          </div>
          <p className="opacity-60">{data?.format?.slice(0, 3)}</p>
        </div>
        <div></div>
      </div>

      {/* FOR IMAGE GLOW */}
      {glow && (
        <img
          src={data?.coverImage?.extraLarge}
          alt=""
          className="absolute top-0 z-0 h-60 w-40 rounded-md object-cover opacity-0 blur-2xl contrast-200 saturate-200 transition-all duration-500 ease-in-out group-hover:opacity-70"
        />
      )}
    </div>
  )
}
