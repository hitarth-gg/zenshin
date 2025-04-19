import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useGetAnimeAnimePahe from '../hooks/useGetAnimeAnimePahe'
import CenteredLoader from '../../../ui/CenteredLoader'
import { Button, Skeleton } from '@radix-ui/themes'
import useGetAnimeById from '../../../hooks/useGetAnimeById'
import { useZenshinContext } from '../../../utils/ContextProvider'
import { PersonIcon, StarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import useGetAnimeByMalId from '../../../hooks/useGetAnimeByMalId'
import parse from 'html-react-parser'
import { autop } from '@wordpress/autop'
import useGetAnimePaheEps from '../hooks/useGetAnimePaheEps'
import { useEffect, useState } from 'react'
import AnimePaheEpisode from '../components/AnimePaheEpisode'
import { parseAnimepaheImage } from '../utils/parseAnimepaheImage'
import AniListLogo from '../../../assets/symbols/AniListLogo'
import MyAnimeListLogo from '../../../assets/symbols/MyAnimeListLogo'
import YouTubeLogo from '../../../assets/symbols/YouTubeLogo'
import AnilistEditorModal from '../../../components/AnilistEditorModal'
import BooksLogo from '../../../assets/symbols/BooksLogo'

function AnimePahePage() {
  const zenshinContext = useZenshinContext()
  const { glow } = zenshinContext

  const { animeId } = useParams()
  const { isLoading, data: animepaheData, error, status } = useGetAnimeAnimePahe(animeId)
  const anilistId = animepaheData?.anilist_id
  const [hideWatchedEpisodes, setHideWatchedEpisodes] = useState(false)

  console.log(animepaheData);

  const {
    isLoading: isLoadingAnilist,
    animeData,
    error: errorAnilist,
    status: statusAnilist
  } = useGetAnimeById(anilistId || null)

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

  const [episodesWatched, setEpisodesWatched] = useState(animeData?.mediaListEntry?.progress || 0)
  const [showRelations, setShowRelations] = useState(false)
  const relations = animeData?.relations?.edges.filter((edge) => edge.node.type === 'ANIME')
  const navigate = useNavigate()
  useEffect(() => {
    setEpisodesWatched(animeData?.mediaListEntry?.progress || 0)
  }, [animeData?.mediaListEntry?.progress])

  console.log(episodesWatched)

  const data = animeData
  const genresString = data?.genres?.join(', ') || ''
  const [showFullDescription, setShowFullDescription] = useState(false)

  const startDate = data?.startDate
    ? new Date(data.startDate.year, data.startDate.month - 1, data.startDate.day)
    : null

  // const bookmarks = {
  //   torrents: {
  //     url: '',
  //     title: '',
  //     image: '',
  //     episodesWatched: 9
  //   },
  //   animepahe: {
  //     url: '',
  //     title: '',
  //     image: '',
  //     episodesWatched: 9
  //   }
  // }

  const url = useLocation().pathname
  console.log('url', url)

  const [bookmarkData, setBookmarkData] = useState(
    JSON.parse(localStorage.getItem('bookmarks'))?.animepahe[url]
  )
  const isBookmarked = bookmarkData ? true : false
  const finalEpWatched = bookmarkData?.episodesWatched || 0

  function addBookmark() {
    console.log('Adding', data)
    const newBookmark = {
      url: url,
      title: data?.title.romaji || animepaheData.title,
      image: data?.coverImage.extraLarge || parseAnimepaheImage(animepaheData.cover),
      episodesWatched: 0
    }
    console.log('newBookmark', newBookmark)
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {
      torrents: {},
      animepahe: {}
    }
    bookmarks.animepahe[url] = newBookmark
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    setBookmarkData(newBookmark)
  }

  function removeBookmark() {
    console.log('Removing', data)
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {
      torrents: {},
      animepahe: {}
    }
    delete bookmarks.animepahe[url]
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    setBookmarkData(null)
  }

  function epCountBookmark(query) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {
      torrents: {},
      animepahe: {}
    }
    // if bookmark is not found, add it
    if (!bookmarks.animepahe[url]) {
      addBookmark()
    }
    if (query === 'increase') {
      bookmarks.animepahe[url].episodesWatched += 1
    } else {
      if (bookmarks.animepahe[url].episodesWatched > 0)
        bookmarks.animepahe[url].episodesWatched -= 1
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    setBookmarkData(bookmarks.animepahe[url])
  }

  const activityDetails = {
    details: `${animeData?.title.romaji} • ${animeData?.title.native}`,
    state: `Browsing ${animeData?.title.romaji}`,
    assets: {
      large_image: animeData?.coverImage?.medium || animeData?.coverImage.extraLarge,
      small_text: 'Zenshin'
    }
  }

  function setDiscordRPC() {
    if (!animeData) return
    window.api.setDiscordRpc(activityDetails)
  }

  useEffect(() => {
    setDiscordRPC()
    return () => {
      window.api.setDiscordRpc({ details: 'Browsing Anime' })
    }
  }, [animeData, episodesWatched])

  if (isLoading || (isLoadingAnilist && anilistId)) return <CenteredLoader />

  return (
    <div className="select-none">
      {data?.bannerImage && (
        <div className="relative">
          {glow && (
            <div className="animate-fade-down">
              <img
                src={data?.bannerImage}
                className="absolute top-7 z-0 h-72 w-full object-cover opacity-70 blur-3xl brightness-75 saturate-150 2xl:h-96"
                alt=""
              />
            </div>
          )}
          <img
            src={data?.bannerImage}
            className="z-10 h-72 w-full animate-fade-down object-cover brightness-90 transition-all ease-in-out 2xl:h-96"
            alt=""
          />
        </div>
      )}
      <div className="z-30 mx-auto animate-fade px-6 py-4 lg:container">
        <div className="flex justify-between gap-x-7">
          <img
            src={data?.coverImage.extraLarge || parseAnimepaheImage(animepaheData.cover)}
            // src={data?.coverImage.extraLarge}
            alt=""
            className={`duration-400 relative ${data?.bannerImage ? 'bottom-[4rem]' : ''} shadow-xl drop-shadow-2xl h-[25rem] w-72 animate-fade-up rounded-md object-cover transition-all ease-in-out`}
            // className={`duration-400 relative h-96 w-72 animate-fade rounded-md object-cover transition-all ease-in-out`}
          />
          <div className="flex-1 justify-start gap-y-0">
            <p className="font-space-mono text-xl font-medium tracking-wider">
              {data?.title.romaji || animepaheData.title}
            </p>
            <p className="text mb-2 border-b border-[#545454] pb-2 font-space-mono font-medium tracking-wider opacity-80">
              {data?.title.english}
              {data?.title?.native ? ` • ${data?.title?.native}` : ''}
            </p>
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
            {genresString && (
              <div className="mb-2 flex w-fit gap-x-1 border-b border-[#545454] pb-2 font-space-mono text-xs tracking-wide opacity-90">
                {genresString}
              </div>
            )}
            <div
              className={`relative flex ${showFullDescription ? '' : 'max-h-[9.55rem]'} flex-col gap-y-2 overflow-hidden pb-6 font-space-mono text-sm opacity-55 transition-all`}
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {parse(
                autop(
                  malIdData?.data?.synopsis ||
                    data?.description ||
                    animepaheData.desc ||
                    'No description'
                )
              )}
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
              {anilistId && (
                <Link target="_blank" to={`https://anilist.co/anime/${data?.id}`}>
                  <Button size={'1'} variant="ghost" color="gray">
                    <AniListLogo />
                  </Button>
                </Link>
              )}
              {malIdData?.data?.url && (
                <Link target="_blank" to={malIdData?.data?.url}>
                  <Button size={'1'} variant="ghost" color="gray">
                    <MyAnimeListLogo />
                  </Button>
                </Link>
              )}
              {data?.trailer?.site === 'youtube' && (
                <Link target="_blank" to={`https://www.youtube.com/watch?v=${data?.trailer?.id}`}>
                  <Button size={'1'} variant="ghost" color="gray">
                    <YouTubeLogo />
                  </Button>
                </Link>
              )}
              {/* ANILIST Episode Manager */}
              {anilistId && (
                <>
                  <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
                  <AnilistEditorModal
                    anilist_data={data}
                    setEpisodesWatchedMainPage={setEpisodesWatched}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {relations && showRelations && (
          <div
            className={`grid h-full w-full animate-fade grid-cols-2 animate-duration-300 xl:grid-cols-3`}
          >
            {relations.map((relation, ix) => (
              <div
                key={ix}
                className="my-2 h-fit cursor-pointer transition-all duration-200 ease-in-out"
                onClick={() => navigate(`/anime/${relation?.node?.id}`)}
              >
                <div className="flex w-[25rem] font-space-mono text-xs text-[#dcdcdc]">
                  <img
                    src={relation?.node?.coverImage?.medium}
                    alt=""
                    className="h-28 w-20 object-cover transition-all ease-in-out"
                  />
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

        {true && epsData?.data[0] !== null && (
          <div className="mb-64 mt-12">
            <div className="flex items-center gap-x-3">
              <p className="font-space-mono text-lg font-medium opacity-90">Episodes</p>
              <Button
                variant="soft"
                size={'1'}
                onClick={() => setHideWatchedEpisodes(!hideWatchedEpisodes)}
                color={hideWatchedEpisodes ? 'blue' : 'gray'}
              >
                Hide Watched Episodes
              </Button>
            </div>
            {!isLoadingEps && (
              <div className="mt-3 grid grid-cols-1 gap-y-3">
                {epsData?.data
                  ?.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))
                  .map((episode, ix) => (
                    <AnimePaheEpisode
                      key={episode.id}
                      data={{
                        ...episode,
                        ...animeData,
                        anime_title: data?.title.romaji || animepaheData.title,
                        anime_hash: animeId,
                        finalEpWatched,
                        ix,
                        hideWatchedEpisodes,
                        progress: episodesWatched,
                        discordRpcActivity: activityDetails
                      }}
                    />
                  ))}
              </div>
            )}
            {isLoadingEps && <Skeleton className="mt-3 h-12" />}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnimePahePage
