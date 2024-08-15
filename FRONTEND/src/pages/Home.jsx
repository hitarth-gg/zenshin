import AnimeCard from "../components/AnimeCard";
import useTopAiringAnime from "../hooks/useTopAiringAnime";
import zenshin1 from "../assets/zenshin2.png";
import zenshinLogo from "../assets/zenshinLogo.png";
import useGetTopAnime from "../hooks/useGetTopAnime";
import InfiniteScroll from "react-infinite-scroll-component";
import { getTopAnime } from "../utils/helper";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
export default function Home() {
  const { isLoading, topAiringAnime, error, status } = useTopAiringAnime();
  // const { isLoading2, topAnime, error2, status2 } = useGetTopAnime();
  // const { isLoading2, topAnime:topAnimeTS, error2, status2 } = useGetTopAnime();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error: infiniteQueryError,
  } = useInfiniteQuery({
    queryKey: ["top_animes"],
    queryFn: ({ pageParam = 1 }) => getTopAnime(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length + 1;
    },
  });

  console.log(data);

  // if (error) {
  //   throw new Error(error);
  // }
  // const [page, setPage] = useState(1);

  // const [prevTopAnime, setPrevTopAnime] = useState([]);
  // const[topAnime, setTopAnime] = useState([]);

  // async function fetchMoreData() {
  // // const { isLoading2, topAnime:topAnimeTS, error2, status2 } = useGetTopAnime();
  // // const data = await getTopAnime(page);
  //   console.log(data); // Add this line to inspect the structure
  //   setPage(page + 1);
  //   setPrevTopAnime([...prevTopAnime, ...data.data]);
  //   setTopAnime([...topAnime, ...data.data]);
  // }

  // console.log(topAnime);

  // const topAnime = data?.pages?.flatMap((page) => page.data) || [];
  // console.log(topAnime);

  const [topAnime, setTopAnime] = useState([]);

  useEffect(() => {
    if (data) {
      const newTopAnime = data.pages
        .map((page) => page.data)
        .flat()
        .filter(Boolean);
      setTopAnime(newTopAnime);
    }
  }, [data]);

  return (
    <div className="font-space-mono tracking-tight">
      <div className="flex min-h-[94svh] animate-fade flex-col items-center justify-around gap-y-11 lg:flex-row">
        <div className="flex h-full w-2/5 flex-col items-center justify-start gap-y-10 p-3">
          <img
            src={zenshinLogo}
            alt=""
            className="h-[6rem] object-scale-down"
          />
          <p className="font-space-mono">
            Stream your favorite torrents instantly with our service, no waiting
            for downloads, reliable and seamless streaming directly to your
            browser. Built with <span className="text-cyan-300">React</span>,{" "}
            <span className="text-orange-300">TanStack Query</span>, Radix UI,
            ExpressJS, Tailwind CSS,{" "}
            <span className="text-red-500">WebTorrent</span>, Video.JS, and
            more.
          </p>
        </div>
        <img
          src={zenshin1}
          alt="zenshin"
          className="h-48 object-scale-down sm:h-64 md:h-80 lg:h-96"
        />
      </div>

      {error && (
        <div className="text-red-500">
          Failed to fetch Top Airing Anime : {error.message}
        </div>
      )}

      {status === "success" && !error && (
        <div className="mx-5">
          <div className="ml-8 border-b border-gray-700 pb-1 font-space-mono font-bold">
            Top Airing Anime
          </div>
          <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {status === "success" &&
              topAiringAnime?.data?.map((anime) => <AnimeCard data={anime} />)}
          </div>
        </div>
      )}

      {infiniteQueryError && (
        <div className="text-red-500">
          Failed to fetch Top Anime : {infiniteQueryError.message}
        </div>
      )}

      {!infiniteQueryError && topAnime.length > 0 && (
        <div className="mx-5">
          <div className="ml-8 border-b border-gray-700 pb-1 font-space-mono font-bold">
            Top Anime
          </div>
          <InfiniteScroll
            dataLength={topAnime.length}
            next={() => fetchNextPage()}
            hasMore={topAnime?.length < 200}
            loader={<h4>Loading...</h4>}
          >
            <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
              {topAnime?.map((anime) => {
                return <AnimeCard key={anime.mal_id} data={anime} />;
              })}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}
