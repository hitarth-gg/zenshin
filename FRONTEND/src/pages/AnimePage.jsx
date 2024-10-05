import { Link, useParams } from 'react-router-dom'
import useGetAnimeById from '../hooks/useGetAnimeById'
import { format } from 'date-fns'
import { useState } from 'react'
import CenteredLoader from '../ui/CenteredLoader'
import Episode from '../components/Episode'
import { Button, Skeleton } from '@radix-ui/themes'
import { toast } from 'sonner'
import { ExclamationTriangleIcon, PersonIcon, StarIcon } from '@radix-ui/react-icons'
import useGetAniZipMappings from '../hooks/useGetAniZipMappings'
import useGetAnimeByMalId from '../hooks/useGetAnimeByMalId'
import { autop } from '@wordpress/autop'
import parse from 'html-react-parser'
import { useZenshinContext } from '../utils/ContextProvider'

export default function AnimePage() {
  const zenshinContext = useZenshinContext()
  const { glow } = zenshinContext

  const animeId = useParams().animeId
  const { isLoading, animeData, error, status } = useGetAnimeById(animeId)
  const malId = animeData?.idMal
  const episodesWatched = animeData?.mediaListEntry?.progress || 0

  const {
    isLoading: isLoadingMappings,
    data: mappingsData,
    error: errorMappings,
    status: statusMappings
  } = useGetAniZipMappings(animeId)

  const {
    isLoading: isLoadingMalId,
    data: malIdData,
    error: errorMalId,
    status: statusMalId
  } = useGetAnimeByMalId(malId || null)

  let episodesAnizip = mappingsData?.episodes
  let aniZip_titles = {
    en: '',
    ja: '',
    xJat: '',
    malTitleRomaji: '',
    malTitleEnglish: ''
  }
  if (mappingsData?.titles) {
    aniZip_titles.en = mappingsData?.titles?.en || ''
    aniZip_titles.ja = mappingsData?.titles?.ja || ''
    aniZip_titles.xJat = mappingsData?.titles['x-jat'] || ''
    aniZip_titles.malTitleRomaji = malIdData?.data?.titles[0]?.title || ''
    aniZip_titles.malTitleEnglish = malIdData?.data?.titles[4]?.title || ''
  }

  if (episodesAnizip) {
    episodesAnizip = Object.keys(episodesAnizip)?.map((key) => episodesAnizip[key])
    let tempEps = episodesAnizip.map((ep) => {
      if (isNaN(ep.episode)) return null
      return {
        epNum: ep.episode,
        title: ep.title.en || ep.title['x-jat'] || ep.title.jp || `Episode ${ep.episode}`,
        thumbnail: ep.image,
        airdate: ep.airdate,
        overview: ep.overview,
        aids: mappingsData?.mappings?.anidb_id,
        eids: ep.anidbEid
      }
    })

    // remove null values
    tempEps = tempEps.filter((ep) => ep !== null)
    episodesAnizip = tempEps
  }

  const [dualAudio, setDualAudio] = useState(false)
  const [hideWatchedEpisodes, setHideWatchedEpisodes] = useState(false)

  if (isLoading) return <CenteredLoader />

  if (errorMappings || errorMalId) {
    toast.error('Error fetching Anime', {
      icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
      description: `Couldn't fetch anime: ${errorMappings?.message || errorMalId?.message}`,
      classNames: {
        title: 'text-rose-500'
      }
    })
  }

  if (error) {
    throw new Error(error)
  }

  if (status !== 'success') return <CenteredLoader />

  const data = animeData

  const startDate = data?.startDate
    ? new Date(data.startDate.year, data.startDate.month - 1, data.startDate.day)
    : null

  const endDate = data?.endDate
    ? new Date(data.endDate.year, data.endDate.month - 1, data.endDate.day)
    : null

  let animeEpisodes = data?.streamingEpisodes
  animeEpisodes?.sort((a, b) => {
    const aNum = parseInt(a.title.split(' ')[1])
    const bNum = parseInt(b.title.split(' ')[1])
    return aNum - bNum
  })

  // if (!animeEpisodes) {
  // animeEpisodes = episodesAnizip;
  // } else if (episodesAnizip.length >= animeEpisodes.length) {
  animeEpisodes = episodesAnizip
  // }

  return (
    <div>
      {/* {false && ( */}
      {data?.bannerImage && (
        // <div className="p-4 px-8">
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
              {data.averageScore && (
                <>
                  <div className="flex gap-x-1 tracking-wide opacity-90">
                    <StarIcon /> {data.averageScore} / 100
                  </div>
                  <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
                </>
              )}
              <div className="flex gap-x-1 tracking-wide opacity-90">
                <PersonIcon />
                {data.popularity.toLocaleString()}
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
          <div className="mb-64 mt-5">
            <div className="flex items-center gap-x-3">
              <p className="font-space-mono text-lg font-medium opacity-90">Episodes</p>
              <Button
                size={'1'}
                onClick={() => setDualAudio(!dualAudio)}
                color={dualAudio ? 'blue' : 'gray'}
              >
                English Dub
              </Button>
              <Button
                size={'1'}
                onClick={() => setHideWatchedEpisodes(!hideWatchedEpisodes)}
                color={hideWatchedEpisodes ? 'blue' : 'gray'}
              >
                Hide Watched Episodes
              </Button>
            </div>
            {!isLoadingMappings && (
              <div className="mt-3 grid grid-cols-1 gap-y-3">
                <Episode
                  all={true}
                  anime={data.title}
                  dualAudio={dualAudio}
                  data={{ aids: mappingsData?.mappings?.anidb_id, quality: '1080p', eids: 0 }}
                  bannerImage={data?.bannerImage}
                />
                {animeEpisodes?.map((episode, ix) => (
                  <Episode
                    key={'ep -' + ix}
                    anime={data.title}
                    animeId={data.id}
                    data={{
                      ...episode,
                      progress: episodesWatched,
                      hideWatchedEpisodes,
                      quality: '1080p'
                    }}
                    dualAudio={dualAudio}
                    episodeNumber={ix + 1}
                    aniZip_titles={aniZip_titles}
                    bannerImage={data?.bannerImage}
                  />
                ))}
              </div>
            )}
            {isLoadingMappings && <Skeleton className="mt-3 h-12" />}
          </div>
        )}
      </div>
    </div>
  )
}
