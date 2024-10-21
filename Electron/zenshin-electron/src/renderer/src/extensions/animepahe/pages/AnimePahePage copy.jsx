import { Link, useParams } from 'react-router-dom'
import useGetAnimeAnimePahe from '../hooks/useGetAnimeAnimePahe'
import CenteredLoader from '../../../ui/CenteredLoader'
import { Button, DropdownMenu } from '@radix-ui/themes'
import useGetAnimeById from '../../../hooks/useGetAnimeById'
import { useZenshinContext } from '../../../utils/ContextProvider'
import { PersonIcon, StarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import useGetAniZipMappings from '../../../hooks/useGetAniZipMappings'
import useGetAnimeByMalId from '../../../hooks/useGetAnimeByMalId'
import parse from 'html-react-parser'
import { autop } from '@wordpress/autop'
import useGetAnimePaheEps from '../hooks/useGetAnimePaheEps'
import { useState } from 'react'
import AnimepaheEpisodeCard from '../components/AnimepaheEpisodeCard'

function AnimePahePage() {
  const zenshinContext = useZenshinContext()
  const { glow } = zenshinContext

  const { animeId } = useParams()
  const { isLoading, data: animepaheData, error, status } = useGetAnimeAnimePahe(animeId)
  const anilistId = animepaheData?.anilist_id

  const {
    isLoading: isLoadingAnilist,
    animeData,
    error: errorAnilist,
    status: statusAnilist
  } = useGetAnimeById(anilistId)

  const malId = animeData?.idMal

  const {
    isLoading: isLoadingMalId,
    data: malIdData,
    error: errorMalId,
    status: statusMalId
  } = useGetAnimeByMalId(malId || null)

  const {
    isLoading: isLoadingEps,
    data: epsData,
    error: errorEps,
    status: statusEps
  } = useGetAnimePaheEps(animeId, 1)

  const [dualAudio, setDualAudio] = useState(false)
  const episodesWatched = animeData?.mediaListEntry?.progress || 0
  const [quality, setQuality] = useState('All')
  const [hideWatchedEpisodes, setHideWatchedEpisodes] = useState(false)
  const data = animeData

  const startDate = data?.startDate
    ? new Date(data.startDate.year, data.startDate.month - 1, data.startDate.day)
    : null

  if (isLoading || isLoadingAnilist) return <CenteredLoader />

  return (
    <div>
      {data?.bannerImage && (
        <div className="relative">
          {glow && (
            <div className="animate-fade-down">
              <img
                src={data?.bannerImage}
                className="absolute top-0 z-0 h-72 w-full object-cover opacity-70 blur-3xl brightness-75 saturate-150"
                alt=""
              />
            </div>
          )}
          <img
            src={data?.bannerImage}
            className="z-10 h-72 w-full animate-fade-down object-cover brightness-75"
            alt=""
          />
        </div>
      )}
      <div className="z-10 mx-auto animate-fade px-6 py-4 lg:container">
        <div className="flex justify-between gap-x-7">
          <img
            src={data?.coverImage.extraLarge}
            alt=""
            className={`duration-400 relative ${data?.bannerImage ? 'bottom-[4rem]' : ''} shadow-xl drop-shadow-2xl h-[25rem] w-72 animate-fade-up rounded-md object-cover transition-all ease-in-out`}
            // className={`duration-400 relative h-96 w-72 animate-fade rounded-md object-cover transition-all ease-in-out`}
          />
          <div className="flex-1 justify-start gap-y-0">
            <p className="font-space-mono text-xl font-medium opacity-90">{data?.title.romaji}</p>
            <p className="text font-space-mono font-medium opacity-60">{data?.title.english}</p>
            <div className="my-3 h-[1px] w-full bg-[#333]"></div> {/* Divider */}
            <div className="flex w-fit gap-x-2 pr-4 text-xs opacity-60">
              <p className="">{data?.format}</p>
              <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
              <p>{`${data?.episodes ? data?.episodes : '?'} episodes`}</p>
              <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
              <p>({data?.status})</p>
              <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
              <p className="text-xs opacity-60">
                {data && format(new Date(startDate), 'MMMM yyyy')}
              </p>
              <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
              <p className="opacity-60">{data?.season}</p>
              <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
              {data?.averageScore && (
                <>
                  <div className="flex gap-x-1 tracking-wide opacity-90">
                    <StarIcon /> {data.averageScore} / 100
                  </div>
                  <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
                </>
              )}
              <div className="flex gap-x-1 tracking-wide opacity-90">
                <PersonIcon />
                {data?.popularity.toLocaleString()}
              </div>
            </div>
            <div className="my-3 h-[1px] w-1/2 bg-[#333]"></div> {/* Divider */}
            <div className="animate-fade animate-duration-1000">
              <div className="flex flex-col gap-y-2 font-space-mono text-sm opacity-55">
                {parse(autop(malIdData?.data?.synopsis || data?.description || 'No description'))}
              </div>
            </div>
            <div className="mt-6 flex gap-x-5">
              <Link target="_blank" to={data?.siteUrl}>
                <Button size={'1'} variant="">
                  AniList
                </Button>
              </Link>
              {malIdData?.data?.url && (
                <Link target="_blank" to={malIdData?.data?.url}>
                  <Button size={'1'} variant="">
                    MyAnimeList
                  </Button>
                </Link>
              )}
              {data?.trailer?.site === 'youtube' && (
                <Link target="_blank" to={`https://www.youtube.com/watch?v=${data?.trailer.id}`}>
                  <Button size={'1'} color="red" variant="">
                    YouTube
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {true && (
          <div className="mb-64 mt-12">
            <div className="flex items-center gap-x-3">
              <p className="font-space-mono text-lg font-medium opacity-90">Episodes</p>
              <Button
                variant="soft"
                size={'1'}
                onClick={() => setDualAudio(!dualAudio)}
                color={dualAudio ? 'blue' : 'gray'}
              >
                English Dub
              </Button>
              <Button
                variant="soft"
                size={'1'}
                onClick={() => setHideWatchedEpisodes(!hideWatchedEpisodes)}
                color={hideWatchedEpisodes ? 'blue' : 'gray'}
              >
                Hide Watched Episodes
              </Button>
              <DropdownMenu.Root className="nodrag" modal={false}>
                <DropdownMenu.Trigger>
                  <Button variant="soft" color="gray" size={'1'}>
                    <div className="flex animate-fade items-center gap-x-2">Quality: {quality}</div>
                    <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    color={`${quality === 'All' ? 'indigo' : 'gray'}`}
                    onClick={() => setQuality('All')}
                  >
                    All
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    color={`${quality === '1080p' ? 'indigo' : 'gray'}`}
                    shortcut="HD"
                    onClick={() => setQuality('1080p')}
                  >
                    1080p
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    color={`${quality === '720p' ? 'indigo' : 'gray'}`}
                    shortcut="SD"
                    onClick={() => setQuality('720p')}
                  >
                    720p
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
            {!isLoadingEps && (
              <div className="grid animate-fade grid-cols-4">
                {epsData?.data?.map((episode, ix) => (
                  <AnimepaheEpisodeCard key={episode.id} data={episode} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnimePahePage
