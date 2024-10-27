import { Link, useLocation, useParams } from 'react-router-dom'
import useGetAnimeAnimePahe from '../hooks/useGetAnimeAnimePahe'
import CenteredLoader from '../../../ui/CenteredLoader'
import { Button, Skeleton } from '@radix-ui/themes'
import useGetAnimeById from '../../../hooks/useGetAnimeById'
import { useZenshinContext } from '../../../utils/ContextProvider'
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  DividerVerticalIcon,
  MinusIcon,
  PersonIcon,
  PlusIcon,
  StarIcon
} from '@radix-ui/react-icons'
import { format } from 'date-fns'
import useGetAnimeByMalId from '../../../hooks/useGetAnimeByMalId'
import parse from 'html-react-parser'
import { autop } from '@wordpress/autop'
import useGetAnimePaheEps from '../hooks/useGetAnimePaheEps'
import { useState } from 'react'
import AnimePaheEpisode from '../components/AnimePaheEpisode'
import { parseAnimepaheImage } from '../utils/parseAnimepaheImage'

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

  const data = animeData
  const genresString = data?.genres?.join(', ') || ''

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

  if (isLoading || (isLoadingAnilist && anilistId)) return <CenteredLoader />

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
            <div className="animate-fade animate-duration-1000">
              <div className="flex flex-col gap-y-2 font-space-mono text-sm opacity-55">
                {parse(
                  autop(
                    malIdData?.data?.synopsis ||
                      data?.description ||
                      animepaheData.desc ||
                      'No description'
                  )
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-x-5">
              {anilistId && (
                <Link target="_blank" to={data?.siteUrl}>
                  <Button size={'1'} variant="">
                    AniList
                  </Button>
                </Link>
              )}
              {malIdData?.data?.url && (
                <Link target="_blank" to={malIdData?.data?.url}>
                  <Button size={'1'} variant="">
                    MyAnimeList
                  </Button>
                </Link>
              )}
              {data?.trailer?.site === 'youtube' && (
                <Link target="_blank" to={`https://www.youtube.com/watch?v=${data?.trailer?.id}`}>
                  <Button size={'1'} color="red" variant="">
                    YouTube
                  </Button>
                </Link>
              )}
              <DividerVerticalIcon width={20} height={20} color="#ffffff40" />
              <div className="flex items-center justify-center gap-x-5">
                <Button
                  size={'1'}
                  color="gray"
                  variant="soft"
                  onClick={isBookmarked ? removeBookmark : addBookmark}
                >
                  {/* <BookmarkIcon width={'16px'} height={'16px'} /> */}
                  {/* <BookmarkFilledIcon width={'16px'} height={'16px'} /> */}

                  {isBookmarked ? (
                    <BookmarkFilledIcon width={'16px'} height={'16px'} />
                  ) : (
                    <BookmarkIcon width={'16px'} height={'16px'} />
                  )}
                </Button>
                <Button
                  size={'1'}
                  color="gray"
                  variant="soft"
                  onClick={() => epCountBookmark('decrease')}
                >
                  <MinusIcon width={'16px'} height={'16px'} />
                </Button>
                <Button
                  size={'1'}
                  color="gray"
                  variant="soft"
                  onClick={() => epCountBookmark('increase')}
                >
                  <PlusIcon width={'16px'} height={'16px'} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {true && (
          <div className="mb-64 mt-12">
            <div className="flex items-center gap-x-3">
              <p className="font-space-mono text-lg font-medium opacity-90">Episodes</p>
            </div>
            {!isLoadingEps && (
              <div className="mt-3 grid grid-cols-1 gap-y-3">
                {epsData?.data
                  ?.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))
                  .map((episode, ix) => (
                    <AnimePaheEpisode
                      key={episode.id}
                      data={{ ...episode, anime_hash: animeId, finalEpWatched, ix }}
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
