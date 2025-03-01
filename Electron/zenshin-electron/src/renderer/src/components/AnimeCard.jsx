import { format, fromUnixTime } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import '../index.css'
import { useZenshinContext } from '../utils/ContextProvider'
import { Button, Skeleton, Tooltip } from '@radix-ui/themes'
import { useEffect, useRef, useState } from 'react'
import AnilistEditorModal from './AnilistEditorModal'
import { PersonIcon, StarIcon } from '@radix-ui/react-icons'
import YouTubeLogo from '../assets/symbols/YouTubeLogo'

export default function AnimeCard({ data }) {
  // console.log(data);
  const navigate = useNavigate()
  function handleClick() {
    navigate(`/anime/${data.id}`, { state: { data } })
  }
  const { bannerImage } = data
  const [imageLoading, setImageLoading] = useState(true)
  const [videoLoading, setVideoLoading] = useState(true)
  const zenshinContext = useZenshinContext()
  const { glow, hoverCard } = zenshinContext

  const date = data?.startDate?.year
    ? new Date(data.startDate.year, data.startDate.month - 1, data.startDate.day)
    : null

  const status = data?.mediaListEntry?.status
  const [card, setCard] = useState(0)
  const divRef = useRef(null)
  const videoSrc =
    data?.trailer?.site === 'youtube'
      ? `https://www.youtube.com/watch?v=${data?.trailer?.id}`
      : null //0c4IoCA5fY0
  // data?.trailer?.site === 'youtube'
  // ? `https://www.youtube.com/embed/${data?.trailer?.id}?autoplay=1`
  // : null //0c4IoCA5fY0

  const [pos2, setPos2] = useState(0)
  useEffect(() => {
    if (!divRef.current) return
    const cut = divRef.current.getBoundingClientRect()
    const l = cut.left
    const r = window.innerWidth - cut.right

    setPos2('-4rem')
    if (l < 100) setPos2('0rem')
    else if (r < 100) setPos2('-8rem')
  }, [card])
  const genresString = data?.genres?.join(', ') || ''

  return (
    <div
      className="relative my-4 w-fit"
      onMouseOver={() => setCard(1)}
      onMouseLeave={() => setCard(0)}
      onClick={() => handleClick()}
      ref={divRef}
    >
      {
        <div
          onClick={() => handleClick()}
          className={`group relative flex w-[10.6rem] animate-fade cursor-pointer flex-col items-center justify-center gap-y-2 transition-all ease-in-out ${hoverCard ? '' : 'hover:scale-110'}`}
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
              className="line-clamp-2 h-11 w-full text-sm font-medium opacity-90"
            >
              {data?.title?.romaji}
            </div>

            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-x-2">
                <p className="text-nowrap opacity-60">
                  {date && format(new Date(date), 'MMMM yyyy')}
                </p>

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
          {glow && !hoverCard && (
            <img
              src={data?.coverImage?.extraLarge}
              alt=""
              className="absolute top-0 z-0 h-60 w-40 rounded-md object-cover opacity-0 blur-2xl contrast-200 saturate-200 transition-all duration-500 ease-in-out group-hover:opacity-70"
            />
          )}
        </div>
      }
      {/* {true && ( */}
      {card === 1 && hoverCard && (
        <div
          // className="absolute -left-10 top-0 z-40 h-[21.3rem] w-72 animate-fade bg-[#1a1a1d] shadow-3xl drop-shadow-4xl animate-duration-300"
          className="absolute -top-5 z-40 h-[21.3rem] w-80 animate-fade bg-[#1a1a1d] shadow-3xl drop-shadow-4xl animate-duration-300"
          style={{
            left: pos2
          }}
        >
          <div
            // className={`duration-400 relative aspect-video h-auto w-full animate-fade rounded-sm object-cover object-center transition-all ease-in-out`}
            className={`duration-400 relative h-36 w-full animate-fade rounded-sm object-cover object-center transition-all ease-in-out`}
          ></div>
          {/* {videoSrc && (
            <iframe
              onLoad={() => setVideoLoading(false)}
              src={videoSrc}
              frameBorder="0"
              className={`duration-400 absolute top-0 aspect-video h-auto w-full animate-fade rounded-sm object-cover object-center transition-all ease-in-out`}
              allowFullScreen
            />
          )} */}

          {videoLoading && (
            <>
              <img
                src={bannerImage || data?.coverImage?.extraLarge}
                alt=""
                // className={`duration-400 absolute top-0 aspect-video h-auto w-full animate-fade rounded-sm object-cover object-center transition-all ease-in-out`}
                className={`duration-400 absolute top-0 z-10 h-36 w-full animate-fade rounded-sm object-cover object-center drop-shadow-4xl transition-all ease-in-out`}
              />
              {/* {glow && (
                <img
                  src={bannerImage || data?.coverImage?.extraLarge}
                  alt=""
                  // className={`duration-400 absolute top-0 aspect-video h-auto w-full animate-fade rounded-sm object-cover object-center transition-all ease-in-out`}
                  className={`duration-400 absolute top-20 -z-10 h-36 w-full rounded-sm object-cover object-center opacity-70 blur-2xl brightness-75 saturate-150 transition-all ease-in-out`}
                />
              )} */}
            </>
          )}
          <div className="flex flex-col gap-y-2">
            <div
              className="line-clamp-2 px-2 py-1 text-sm font-medium tracking-wide "
              style={{
                // gradient left to right fade to black
                backgroundImage: `linear-gradient(to right, ${
                  data?.coverImage?.color || '#ffffff'
                }40 0%, rgba(0, 0, 0, 0) 100%)`,
                borderLeft: `3px solid ${data?.coverImage?.color || '#ffffff'}`
              }}
            >
              {data?.title?.romaji || data?.title?.english}
            </div>

            {/* Score, eps, type and other anime details */}
            <div className="flex justify-center">
              <div className="mx-2 flex w-full items-center justify-between gap-x-2 border-b border-[#545454] pb-1 text-xs text-gray-300">
                <p className="tracking-wide">{data?.format}</p>
                <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
                <p>{`${data?.episodes ? data?.episodes : '?'} eps`}</p>
                <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
                {data.averageScore && (
                  <>
                    <div className="flex gap-x-1 tracking-wide opacity-90">
                      <StarIcon /> {data.averageScore / 10}
                    </div>
                    <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
                  </>
                )}
                <div className="flex gap-x-1 tracking-wide opacity-90">
                  <PersonIcon />
                  {data.popularity > 999
                    ? `${(data.popularity / 1000).toFixed(1)}k`
                    : data.popularity}
                </div>
              </div>
            </div>

            {genresString && (
              <div className="mx-2 line-clamp-1 border-b border-[#545454] pb-1 text-xs text-gray-300">
                {genresString}
              </div>
            )}

            <div className="line-clamp-1 px-2 pb-1 text-xs tracking-wide">
              {data?.airingSchedule?.nodes[0]?.episode
                ? `Episode ${data?.airingSchedule.nodes[0].episode} : ${format(fromUnixTime(data?.airingSchedule.nodes[0].airingAt), 'dd-LLL-yyyy hh:mm a')}`
                : ''}
            </div>

            <div className="flex">
              <div
                className="mx-2 w-fit"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <AnilistEditorModal anilist_data={data} customStyle={'buttonOnly'} />
              </div>
              {videoSrc && (
                <div
                  className="mx-2 w-fit"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(videoSrc, '_blank')
                  }}
                >
                  <div className="flex">
                    <div className="bg-[#2f3236] px-1">
                      <YouTubeLogo />
                    </div>
                    <Button
                      size={'1'}
                      color="gray"
                      variant="soft"
                      style={{
                        borderRadius: '0rem'
                      }}
                    >
                      Trailer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
