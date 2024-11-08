import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import '../index.css'
import { useZenshinContext } from '../utils/ContextProvider'
import { Tooltip } from '@radix-ui/themes'

export default function RecentActivityCard({ data }) {
  const navigate = useNavigate()

  function handleClick() {
    navigate(`/anime/${data.media.id}`, { state: { data } })
  }

  const zenshinContext = useZenshinContext()
  const { glow } = zenshinContext

  return (
    <div
      onClick={() => handleClick()}
      className="skew3d group relative mt-6 flex w-56 cursor-pointer flex-col items-center justify-center gap-y-2 transition-all ease-in-out hover:scale-110"
    >
      <div className="absolute top-0 h-72 w-48">
        <div className="absolute bottom-0 left-0 z-10 line-clamp-1 flex h-6 w-48 rounded-b-sm bg-[#00000090] px-1 text-sm drop-shadow-3xl  tracking-wide backdrop-blur-sm">
          {data?.media?.title?.romaji}
        </div>
      </div>
      <img
        src={data?.media?.coverImage?.extraLarge}
        alt=""
        className="duration-400 z-0 h-72 w-48 animate-fade rounded-sm object-cover transition-all ease-in-out"
      />

      <div className="flex w-[85%] flex-col gap-y-1">
        <div className="z-10 mx-1 line-clamp-1 flex w-full items-center gap-x-2 text-sm font-medium opacity-90">
          <img
            src={data?.user?.avatar.large}
            alt=""
            className="duration-400 z-0 aspect-square w-8 animate-fade rounded-sm object-cover transition-all ease-in-out"
          />
          {data?.user?.name}
        </div>
      </div>

      {/* FOR IMAGE GLOW */}
      {/* {glow && (
        <img
          src={data?.media?.coverImage?.extraLarge}
          alt=""
          className="absolute top-0 z-0 h-60 w-40 rounded-md object-cover opacity-0 blur-2xl contrast-200 saturate-200 transition-all duration-500 ease-in-out group-hover:opacity-70"
        />
      )} */}
    </div>
  )
}
