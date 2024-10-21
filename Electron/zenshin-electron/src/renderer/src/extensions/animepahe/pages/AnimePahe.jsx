import { useInfiniteQuery } from '@tanstack/react-query'
import { animepaheLatest } from '../utils'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import AnimepaheEpisodeCard from '../components/AnimepaheEpisodeCard'
import { Button, Code, Spinner } from '@radix-ui/themes'
import InfiniteScroll from 'react-infinite-scroll-component'
import NewReleaseCardSkeleton from '../../../skeletons/NewReleaseCardSkeleton'
import AnimePaheSearchBar from '../components/AnimePaheSearchBar'

function AnimePahe() {
  const [latestEps, setLatestEps] = useState([])
  const navigate = useNavigate()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error: infiniteQueryError
  } = useInfiniteQuery({
    queryKey: ['animepahe_latest'],
    queryFn: ({ pageParam = 1 }) => animepaheLatest(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length + 1
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })

  useEffect(() => {
    if (infiniteQueryError) {
      toast.error('Error fetching Top Animes', {
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        description: infiniteQueryError?.message,
        classNames: {
          title: 'text-rose-500'
        }
      })
    }
  }, [infiniteQueryError])

  useEffect(() => {
    if (data) {
      const newLatestEps = data.pages
        .map((page) => page.data)
        .flat()
        .filter(Boolean)
      setLatestEps(newLatestEps)
    }
  }, [data])

  useEffect(() => {
    if (data?.pages[0]?.error) {
      toast.error('Refresh AnimePahe Cookies and refresh the page', {
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        description: data?.pages[0]?.error,
        classNames: {
          title: 'text-rose-500'
        }
      })
    }
  }, [data])

  return (
    <div className="h-full">
      <div className="my-24 px-12">
        {infiniteQueryError && (
          <div className="text-red-500">
            Failed to fetch Top Anime : {infiniteQueryError.message}
          </div>
        )}
        {data?.pages[0]?.error && (
          <div className="mx-5 my-4 w-4/6 rounded-md border border-rose-600 bg-[#1c1317] p-6 font-space-mono text-red-500">
            Refresh AnimePahe cookies using webview by clicking the button below, after animepahe
            loads completely close the webview and <Code color="gray">restart</Code> the app.
          </div>
        )}
        {!infiniteQueryError && (
          <>
            <div className="mb-2 ml-5 border-b border-gray-700 pb-1 font-space-mono text-lg font-bold tracking-wider">
              <div className="flex items-center gap-4">
                <div>Latest AnimePahe Releases:</div>
                <Button
                  size={'1'}
                  variant="soft"
                  color="gray"
                  onClick={() => window.api.openAnimePahe()}
                >
                  Refresh AnimePahe Cookies
                </Button>
              </div>
            </div>
            <InfiniteScroll
              style={{ all: 'unset' }}
              dataLength={latestEps.length}
              next={() => fetchNextPage()}
              hasMore={latestEps?.length < 500}
              loader={
                <div className="flex items-center justify-center gap-x-2 overflow-hidden">
                  {/* <h4>Loading...</h4> */}
                  {/* <Spinner /> */}
                </div>
              }
            >
              <div className="grid animate-fade grid-cols-4">
                {latestEps?.map((anime) => {
                  return <AnimepaheEpisodeCard key={anime.id + 'latestEps'} data={anime} />
                })}
                {isFetching && (
                  <>
                    <NewReleaseCardSkeleton />
                    <NewReleaseCardSkeleton />
                    <NewReleaseCardSkeleton />
                    <NewReleaseCardSkeleton />
                    <NewReleaseCardSkeleton />
                    <NewReleaseCardSkeleton />
                    <NewReleaseCardSkeleton />
                    <NewReleaseCardSkeleton />
                  </>
                )}
              </div>
            </InfiniteScroll>
          </>
        )}
      </div>
    </div>
  )
}

export default AnimePahe
