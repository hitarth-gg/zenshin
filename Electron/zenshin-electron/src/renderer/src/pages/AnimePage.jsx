import { Link, useNavigate, useParams } from 'react-router-dom'
import useGetAnimeById from '../hooks/useGetAnimeById'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import CenteredLoader from '../ui/CenteredLoader'
import Episode from '../components/Episode'
import { Button, DropdownMenu, Skeleton } from '@radix-ui/themes'
import { toast } from 'sonner'
import { ExclamationTriangleIcon, PersonIcon, StarIcon } from '@radix-ui/react-icons'
import useGetAniZipMappings from '../hooks/useGetAniZipMappings'
import useGetAnimeByMalId from '../hooks/useGetAnimeByMalId'
import { autop } from '@wordpress/autop'
import parse from 'html-react-parser'
import { useZenshinContext } from '../utils/ContextProvider'
import AniListLogo from '../assets/symbols/AniListLogo'
import MyAnimeListLogo from '../assets/symbols/MyAnimeListLogo'
import YouTubeLogo from '../assets/symbols/YouTubeLogo'
import AnilistEditorModal from '../components/AnilistEditorModal'
import BooksLogo from '../assets/symbols/BooksLogo'

export default function AnimePage() {
  const zenshinContext = useZenshinContext()
  const { glow } = zenshinContext

  const animeId = useParams().animeId
  const { isLoading, animeData, error, status } = useGetAnimeById(animeId)
  const malId = animeData?.idMal
  // const episodesWatched = animeData?.mediaListEntry?.progress || 0
  const [episodesWatched, setEpisodesWatched] = useState(animeData?.mediaListEntry?.progress || 0)

  useEffect(() => {
    setEpisodesWatched(animeData?.mediaListEntry?.progress || 0)
  }, [animeData?.mediaListEntry?.progress])

  const [quality, setQuality] = useState('All')
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
  const navigate = useNavigate()
  const [dualAudio, setDualAudio] = useState(false)
  const [hideWatchedEpisodes, setHideWatchedEpisodes] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showRelations, setShowRelations] = useState(false)

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

  const relations = animeData?.relations?.edges.filter((edge) => edge.node.type === 'ANIME')

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

  const genresString = data?.genres?.join(', ') || ''

  return (
    <div className="relative select-none">
      {/* {false && ( */}
      {data?.bannerImage && (
        // <div className="p-4 px-8">
        <div className="relative">
          {glow && (
            <div className="animate-fade-down">
              <img
                src={data?.bannerImage}
                className="absolute top-7 z-0 h-72 w-full object-cover opacity-70 blur-3xl brightness-75 saturate-150"
                alt=""
              />
            </div>
          )}
          <img
            src={data?.bannerImage}
            className="z-10 h-72 w-full animate-fade-down object-cover brightness-90 transition-all ease-in-out"
            alt=""
          />
        </div>
      )}
      <div className="z-30 mx-auto animate-fade px-6 py-4 lg:container">
        <div className="flex justify-between gap-x-7">
          <img
            src={data?.coverImage.extraLarge}
            alt=""
            className={`duration-400 relative ${data?.bannerImage ? 'bottom-[4rem]' : ''} shadow-xl drop-shadow-2xl h-[25rem] w-72 animate-fade-up rounded-md object-cover transition-all ease-in-out`}
            // className={`duration-400 relative h-96 w-72 animate-fade rounded-md object-cover transition-all ease-in-out`}
          />
          <div className="flex-1 justify-start gap-y-0">
            <p className="font-space-mono text-xl font-medium tracking-wider">
              {data?.title.romaji}
            </p>
            <p className="text mb-2 border-b border-[#545454] pb-2 font-space-mono font-medium tracking-wider opacity-80">
              {data?.title.english}
              {data?.title?.native ? ` • ${data?.title?.native}` : ''}
            </p>
            {/* <div className="my-3 h-[1px] w-full bg-[#333]"></div> Divider */}
            <div className="mb-2 flex w-fit items-center gap-x-2 border-b border-[#545454] pb-2 text-xs text-gray-300">
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
            {genresString && (
              <div className="mb-2 flex w-fit gap-x-1 border-b border-[#545454] pb-2 font-space-mono text-xs tracking-wide opacity-90">
                {genresString}
              </div>
            )}

            <div
              className={`relative flex ${showFullDescription ? '' : 'max-h-[9.55rem]'} flex-col gap-y-2 overflow-hidden pb-6 font-space-mono text-sm opacity-55 transition-all`}
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {parse(autop(malIdData?.data?.synopsis || data?.description || 'No description'))}
              {!showFullDescription && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#111113] to-transparent" />
              )}
            </div>
            <div className="mt-6 flex items-center gap-x-5">
              {relations?.length > 0 && (
                <Button
                  size={'1'}
                  variant="ghost"
                  color={showRelations ? 'blue' : 'gray'}
                  onClick={() => setShowRelations(!showRelations)}
                >
                  <BooksLogo />
                </Button>
              )}
              <Link target="_blank" to={`https://anilist.co/anime/${data?.id}`}>
                <Button size={'1'} variant="ghost" color="gray">
                  <AniListLogo />
                </Button>
              </Link>
              {malIdData?.data?.url && (
                <Link target="_blank" to={malIdData?.data?.url}>
                  <Button size={'1'} variant="ghost" color="gray">
                    <MyAnimeListLogo />
                  </Button>
                </Link>
              )}
              {data?.trailer?.site === 'youtube' && (
                <Link target="_blank" to={`https://www.youtube.com/watch?v=${data?.trailer.id}`}>
                  <Button size={'1'} variant="ghost" color="gray">
                    <YouTubeLogo />
                  </Button>
                </Link>
              )}
              <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
              {/* ANILIST Episode Manager */}
              <AnilistEditorModal
                anilist_data={data}
                setEpisodesWatchedMainPage={setEpisodesWatched}
              />
            </div>
          </div>
        </div>

        {relations && showRelations && (
          <div
            className={`grid ${data?.bannerImage ? '' : 'mt-14'} h-full w-full animate-fade grid-cols-2 animate-duration-300 xl:grid-cols-3`}
          >
            {relations.map((relation, ix) => (
              <div
                key={ix}
                className="my-2 h-fit cursor-pointer transition-all duration-200 ease-in-out"
                onClick={() => navigate(`/anime/${relation?.node?.id}`)}
              >
                <div className="flex w-[25rem] font-space-mono text-xs text-[#dcdcdc]">
                  <Skeleton
                    style={{
                      borderRadius: '0rem'
                    }}
                  >
                    <img
                      src={relation?.node?.coverImage?.medium}
                      alt=""
                      className="h-28 w-20 object-cover transition-all ease-in-out"
                    />
                  </Skeleton>
                  <div className="flex w-full flex-col items-start border border-gray-700 py-2 pl-2">
                    <p className="line-clamp-3 pr-3">{relation?.node?.title?.userPreferred}</p>
                    <p
                      className={`my-2 line-clamp-3 border ${
                        ['text-cyan-400', 'text-orange-400'][
                          ['SEQUEL', 'PREQUEL'].indexOf(relation?.relationType)
                        ]
                      } border-[#545454] bg-[#00000080] px-1`}
                    >
                      {relation?.relationType?.replace('_', ' ')}{' '}
                      {relation?.node?.seasonYear ? ` | ${relation?.node?.seasonYear}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
            {!isLoadingMappings && (
              <div className="mt-3 grid grid-cols-1 gap-y-3">
                <Episode
                  all={true}
                  anime={data.title}
                  dualAudio={dualAudio}
                  data={{ aids: mappingsData?.mappings?.anidb_id, quality, eids: 0 }}
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
                      quality
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
