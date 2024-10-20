import { useInfiniteQuery } from '@tanstack/react-query'
import { animepaheLatest } from './utils'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import AnimepaheEpisodeCard from './components/AnimepaheEpisodeCard'
import { Spinner } from '@radix-ui/themes'
import InfiniteScroll from 'react-infinite-scroll-component'

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

  console.log('Latest Episodes:', latestEps)

  return (
    <div className="p-12">
      {/* {latestEps.map((ep) => (
          <AnimepaheEpisodeCard key={ep.id} data={ep} />
        ))} */}
      <InfiniteScroll
        style={{ all: 'unset' }}
        dataLength={latestEps.length}
        next={() => fetchNextPage()}
        hasMore={latestEps?.length < 500}
        loader={
          <div className="flex items-center justify-center gap-x-2 overflow-hidden">
            <h4>Loading...</h4>
            <Spinner />
          </div>
        }
      >
        <div className="grid animate-fade grid-cols-4">
          {latestEps?.map((anime) => {
            return <AnimepaheEpisodeCard key={anime.id + 'latestEps'} data={anime} />
          })}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default AnimePahe
