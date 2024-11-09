import { useEffect, useState } from 'react'
import SkeletonAnimeCard from '../skeletons/SkeletonAnimeCard'
import AnimeCard from '../components/AnimeCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button, DropdownMenu, Spinner, TextField } from '@radix-ui/themes'
import {
  MagnifyingGlassIcon,
  OpenInNewWindowIcon,
  PersonIcon,
  StarIcon,
  TrashIcon,
  VideoIcon
} from '@radix-ui/react-icons'
import HTMLReactParser from 'html-react-parser/lib/index'
import { useNavigate } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { searchAnilist } from '../utils/helper'
import ErrorElement from '../ui/ErrorElement'
import useGetAnilistProfile from '../hooks/useGetAnilistProfile'
import { useZenshinContext } from '../utils/ContextProvider'

const statusMap = ['PLANNING', 'CURRENT', 'COMPLETED', 'DROPPED', 'PAUSED']

function Anilist() {
  // type: ANIME, search: $search, sort: $sort, onList: $onList, status: $status, status_not: $status_not, season: $season, seasonYear: $year, genre: $genre, format: $format, format_not: MUSIC
  const { userId } = useZenshinContext()
  console.log(userId)

  const [searchTerm, setSearchTerm] = useState('')
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [season, setSeason] = useState('')
  const [format, setFormat] = useState('')
  const [status, setStatus] = useState('')
  const [watchStatus, setWatchStatus] = useState('')
  const [sort, setSort] = useState('')
  const [year, setYear] = useState('')
  const [isAdult, setIsAdult] = useState(false)
  const [working, setWorking] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const storedSearchTerm = sessionStorage.getItem('search_term_stored')
    if (storedSearchTerm && storedSearchTerm !== '""') {
      setSearchTerm(storedSearchTerm)
    }

    const storedSearchParams = JSON.parse(sessionStorage.getItem('anilist_search_params'))
    if (storedSearchParams) {
      setTitle(storedSearchParams.title)
      setGenre(storedSearchParams.genre)
      setSeason(storedSearchParams.season)
      setFormat(storedSearchParams.format)
      setStatus(storedSearchParams.status)
      setWatchStatus(storedSearchParams.watchStatus)
      setSort(storedSearchParams.sort)
      setYear(storedSearchParams.year)
      setIsAdult(storedSearchParams.isAdult)
    }
  }, [])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error: infiniteQueryError
  } = useInfiniteQuery({
    queryKey: [
      'anilist_search',
      title,
      genre,
      season,
      format,
      status,
      sort,
      year,
      watchStatus,
      isAdult,
      userId
    ],
    queryFn: ({ pageParam = 1 }) =>
      searchAnilist(
        {
          search: title,
          genre,
          season,
          format,
          status,
          watchStatus,
          sort,
          seasonYear: year,
          isAdult,
          userId: statusMap.indexOf(watchStatus) !== -1 ? userId : null
        },
        pageParam
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length + 1
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })

  useEffect(() => {
    console.log('searchTerm: ', searchTerm);
    console.log('title: ', title);

    if (searchTerm === title || searchTerm === '""') {

      setAnime([])}
    // store all the search params in session storage
    sessionStorage.setItem('search_term_stored', searchTerm)
    const obj = {
      title,
      genre,
      season,
      format,
      status,
      watchStatus,
      sort,
      year,
      isAdult
    }
    sessionStorage.setItem('anilist_search_params', JSON.stringify(obj))
  }, [
    useZenshinContext,
    userId,
    searchTerm,
    watchStatus,
    season,
    title,
    genre,
    format,
    status,
    sort,
    year,
    isAdult
  ])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== title) {
        setAnime([])
      }
      if (searchTerm === '""') setTitle('')
      else setTitle(searchTerm)

      sessionStorage.setItem('search_term_stored', searchTerm)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const [anime, setAnime] = useState([])

  useEffect(() => {
    setWorking(false)
    if (data) {
      const newAnime = data.pages
        .map((page) => page)
        .flat()
        .filter(Boolean)
      setAnime(newAnime)
    }
  }, [data])

  function clearAll() {
    setGenre('')
    setSeason('')
    setFormat('')
    setStatus('')
    setWatchStatus('')
    setSort('')
    setYear('')
    setSearchTerm('')
    setTitle('')

    sessionStorage.removeItem('search_term_stored')
    sessionStorage.removeItem('anilist_search_params')
  }

  return (
    <div className="w-full select-none p-10 px-5 font-space-mono tracking-tight">
      <div className="flex w-full items-center justify-between gap-x-5">
        <div className="flex w-fit items-center gap-x-5">
          <div className="search_bar flex items-center md:w-72">
            <TextField.Root
              size={'2'}
              variant="soft"
              color="gray"
              className="w-full"
              placeholder="Search anime"
              value={searchTerm.replace(/"/g, '')}
              onChange={(e) => {
                setSearchTerm(`"${e.target.value}"`)
              }}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </div>

          {/* Genre */}
          <div className="flex">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger>
                <Button variant="ghost" color="gray">
                  <div className="flex animate-fade items-center gap-x-2">
                    <div className="font-inter text-[.8rem] tracking-wider">
                      {genre ? genre[1] + genre.replace(/"/g, '').slice(1).toLowerCase() : 'GENRE'}
                    </div>
                  </div>
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => setGenre('"ACTION"')}>Action</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"ADVENTURE"')}>
                  Adventure
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"COMEDY"')}>Comedy</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"DRAMA"')}>Drama</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"ECCHI"')}>Ecchi</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"FANTASY"')}>
                  Fantasy
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"HORROR"')}>Horror</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"MAHOU SHOUJO"')}>
                  Mahou Shoujo
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"MECHA"')}>Mecha</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"MUSIC"')}>Music</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"MYSTERY"')}>
                  Mystery
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"PSYCHOLOGICAL"')}>
                  Psychological
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"ROMANCE"')}>
                  Romance
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"SCI-FI"')}>Sci-Fi</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"SLICE OF LIFE"')}>
                  Slice of Life
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"SPORTS"')}>Sports</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"SUPERNATURAL"')}>
                  Supernatural
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setGenre('"THRILLER"')}>
                  Thriller
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  color="red"
                  shortcut={<TrashIcon />}
                  onSelect={() => setGenre('')}
                >
                  Any
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>

          {/* Format */}
          <div className="flex">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger>
                <Button variant="ghost" color="gray">
                  <div className="flex animate-fade items-center gap-x-2">
                    <div className="font-inter text-[.8rem] tracking-wider">
                      {/* TV_SHORT, TV, OVA, MOVIE */}
                      {format
                        ? format.split('_').length === 1
                          ? format[0] + format.slice(1).toLowerCase()
                          : format.split('_')[0] +
                            ' ' +
                            format.split('_')[1][0] +
                            format.split('_')[1].slice(1).toLowerCase()
                        : 'FORMAT'}
                    </div>
                  </div>
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => setFormat('TV')}>TV</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setFormat('TV_SHORT')}>
                  TV Short
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setFormat('MOVIE')}>Movie</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setFormat('SPECIAL')}>Special</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setFormat('OVA')}>OVA</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setFormat('ONA')}>ONA</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setFormat('MUSIC')}>Music</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  color="red"
                  shortcut={<TrashIcon />}
                  onSelect={() => setFormat('')}
                >
                  Any
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>

          {/* Season */}
          <div className="flex">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger>
                <Button variant="ghost" color="gray">
                  <div className="flex animate-fade items-center gap-x-2">
                    <div className="font-inter text-[.8rem] tracking-wider">
                      {season ? season[0] + season.slice(1).toLowerCase() : 'SEASON'}
                    </div>
                  </div>
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => setSeason('WINTER')}>Winter</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setSeason('SPRING')}>Spring</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setSeason('SUMMER')}>Summer</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setSeason('FALL')}>Fall</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  color="red"
                  shortcut={<TrashIcon />}
                  onSelect={() => setSeason('')}
                >
                  Any
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>

          {/* YEAR */}
          <div className="flex items-center">
            <DropdownMenu.Root modal={false}>
              <TextField.Root
                color="gray"
                className="w-20"
                variant="soft"
                placeholder="Year"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value)
                }}
                style={{
                  borderRadius: '4px 0 0 4px'
                }}
              >
                <TextField.Slot></TextField.Slot>
              </TextField.Root>
              <DropdownMenu.Trigger>
                <Button
                  variant="soft"
                  size={'2'}
                  color="gray"
                  style={{
                    borderRadius: '0 4px 4px 0'
                  }}
                >
                  <div className="flex animate-fade items-center gap-x-2">
                    <div className="font-inter text-[.8rem] tracking-wider">
                      {/* {year ? year : 'YEAR'} */}
                    </div>
                  </div>
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content>
                {
                  // to current year + 2
                  Array.from({ length: new Date().getFullYear() - 1969 }, (_, i) => i + 1972)
                    .reverse()
                    .map((year) => (
                      <DropdownMenu.Item key={year} onSelect={() => setYear(year)}>
                        {year}
                      </DropdownMenu.Item>
                    ))
                }
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  color="red"
                  shortcut={<TrashIcon />}
                  onSelect={() => setYear('')}
                >
                  Any
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>

          {/* STATUS */}
          <div className="flex">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger>
                <Button variant="ghost" color="gray">
                  <div className="flex animate-fade items-center gap-x-2">
                    <div className="font-inter text-[.8rem] tracking-wider">
                      {status
                        ? status
                            .split('_')
                            .map((word) => word[0] + word.slice(1).toLowerCase())
                            .join(' ')
                        : 'STATUS'}
                    </div>
                  </div>
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => setStatus('RELEASING')}>
                  Releasing
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setStatus('NOT_YET_RELEASED')}>
                  Not Yet Released
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setStatus('FINISHED')}>
                  Finished
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setStatus('CANCELLED')}>
                  Cancelled
                </DropdownMenu.Item>

                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  color="red"
                  shortcut={<TrashIcon />}
                  onSelect={() => setStatus('')}
                >
                  Any
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>

          {/* SORT */}
          <div className="flex">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger>
                <Button variant="ghost" color="gray">
                  <div className="flex animate-fade items-center gap-x-2">
                    <div className="font-inter text-[.8rem] tracking-wider">
                      {sort
                        ? sort
                            .split('_')
                            .map((word) => word[0] + word.slice(1).toLowerCase())
                            .join(' ')
                        : 'SORT'}
                    </div>
                  </div>
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => setSort('POPULARITY_DESC')}>
                  Popularity
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setSort('SCORE_DESC')}>Score</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setSort('TRENDING_DESC')}>
                  Trending
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>

          {/* USER STATUS */}
          <div className="flex">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger>
                <Button
                  variant="outline"
                  color="indigo"
                  size={'1'}
                  style={{
                    padding: '.84rem .55rem'
                  }}
                >
                  <div className="flex animate-fade items-center gap-x-2">
                    <div className="font-inter text-[.8rem] tracking-wider">
                      {watchStatus
                        ? watchStatus
                            .split('_')
                            .map((word) => word[0] + word.slice(1).toLowerCase())
                            .join(' ')
                        : 'WATCH STATUS'}
                    </div>
                  </div>
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => setWatchStatus('PLANNING')}>
                  Planning
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setWatchStatus('CURRENT')}>
                  Current
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setWatchStatus('COMPLETED')}>
                  Completed
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setWatchStatus('DROPPED')}>
                  Dropped
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setWatchStatus('PAUSED')}>
                  Paused
                </DropdownMenu.Item>

                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  color="red"
                  shortcut={<TrashIcon />}
                  onSelect={() => setWatchStatus('')}
                >
                  Any
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
        <div className="mx-5">
          <Button variant="soft" size={'1'} color="gray" onClick={clearAll}>
            <TrashIcon width={'15'} height={'15'} />
          </Button>
        </div>
      </div>

      {infiniteQueryError && (
        <div className="text-red-500">Failed to fetch Top Anime : {infiniteQueryError.message}</div>
      )}

      {infiniteQueryError && (
        <div className="mt-10 flex w-full justify-center">
          <ErrorElement error={infiniteQueryError.message} />
        </div>
      )}

      {!infiniteQueryError &&
        !isFetching &&
        anime.length === 0 &&
        searchTerm === title &&
        !working && (
          <div className="mt-10 flex w-full animate-fade justify-center">
            <ErrorElement
              title={'No anime found !'}
              text={"Are you sure you've entered the right title ?"}
              type={'info'}
            />
            {/* <p className="tracking-wider">No anime found !</p> */}
          </div>
        )}

      {!infiniteQueryError && (
        <div className="mt-12">
          <InfiniteScroll
            style={{ all: 'unset' }}
            dataLength={anime.length}
            next={() => fetchNextPage()}
            hasMore={anime?.length < 500}
            // loader={
            //   <div className="flex items-center justify-center gap-x-2 overflow-hidden">
            //     <h4>Loading...</h4>
            //     <Spinner />
            //   </div>
            // }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg2:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9">
              {anime?.map((anime) => {
                return <AnimeCard key={anime.id + 'topAnime'} data={anime} />
              })}
              {isFetching && (
                <>
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                </>
              )}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  )
}

export default Anilist
