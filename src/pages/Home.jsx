import AnimeCard from "../components/AnimeCard";
import useTopAiringAnime from "../hooks/useTopAiringAnime";
import zenshin1 from "../assets/zenshin2.png";
import zenshinLogo from "../assets/zenshinLogo.png";
export default function Home() {
  const { isLoading, topAnime, error, status } = useTopAiringAnime();
  if (error) {
    throw new Error(error);
  }
  console.log(topAnime?.data[9]);

  return (
    <div className="">
      <div className="flex animate-fade min-h-[90svh] flex-col items-center justify-around gap-y-11 lg:flex-row">
        <div className="flex h-full w-2/5 flex-col items-center justify-start gap-y-10 p-3">
          <img
            src={zenshinLogo}
            alt=""
            className="h-[6rem] object-scale-down"
          />
          <p className="font-space-mono ">
            Stream your favorite torrents instantly with our service, no waiting for downloads,
            reliable, and seamless streaming directly to your
            browser. Built with React, TanStack Query, Radix UI, ExpressJS, Tailwind CSS & WebTorrent
          </p>
        </div>
        {/* <img src={zenshin1} alt="zenshin" className="h-[42rem]" /> */}
        <img
          src={zenshin1}
          alt="zenshin"
          className="h-48 object-scale-down sm:h-64 md:h-80 lg:h-96"
        />
      </div>

      <div>
        <div className="mx-5 grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {status === "success" &&
            topAnime.data.map((anime) => <AnimeCard data={anime} />)}
        </div>
      </div>
    </div>
  );
}
