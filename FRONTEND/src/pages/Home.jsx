import AnimeCard from "../components/AnimeCard";
import useTopAiringAnime from "../hooks/useTopAiringAnime";
import zenshin1 from "../assets/zenshin2.png";
import zenshinLogo from "../assets/zenshinLogo.png";
import useGetTopAnime from "../hooks/useGetTopAnime";
export default function Home() {
  const { isLoading, topAiringAnime, error, status } = useTopAiringAnime();
  const { isLoading2, topAnime, error2, status2 } = useGetTopAnime();
  if (error) {
    throw new Error(error);
  }

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
            ExpressJS, Tailwind CSS, <span className=" text-red-500">WebTorrent</span>, Video.JS, and more.
          </p>
        </div>
        {/* <img src={zenshin1} alt="zenshin" className="h-[42rem]" /> */}
        <img
          src={zenshin1}
          alt="zenshin"
          className="h-48 object-scale-down sm:h-64 md:h-80 lg:h-96"
        />
      </div>

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

      {status === "success" && !error && (
        <div className="mx-5">
          <div className="ml-8 border-b border-gray-700 pb-1 font-space-mono font-bold">
            Top Anime
          </div>
          <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {status === "success" &&
              topAnime?.data?.map((anime) => <AnimeCard data={anime} />)}
          </div>
        </div>
      )}
    </div>
  );
}
