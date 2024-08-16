import { Link, useParams } from "react-router-dom";
import useGetAnimeById from "../hooks/useGetAnimeById";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CenteredLoader from "../ui/CenteredLoader";
import useGetAnimeEpisodesById from "../hooks/useGetAnimeEpisodesById";
import Episode from "../components/Episode";
import { Button, Skeleton } from "@radix-ui/themes";
import { toast } from "sonner";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function AnimePage() {

  const animeId = useParams().animeId;
  console.log(animeId);

    

  const { isLoading, animeData, error, status } = useGetAnimeById(animeId);
  const {
    isLoading: isLoadingEpisodes,
    animeEpisodes,
    error:errorEpisodes,
    statusEpisodes,
  } = useGetAnimeEpisodesById(animeId);

  const [englishDub, setEnglishDub] = useState(false);

  if (isLoading) return <CenteredLoader />;

  if (error) {
    throw new Error(error);
  }
  
  if(errorEpisodes){
    toast.error("Error fetching Top Animes", {
      icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
      description: `Couldn't fetch episodes: ${errorEpisodes?.message}`,
      classNames: {
        title: "text-rose-500",
      },
    });}

  if (status !== "success") return <CenteredLoader />;

  const data = animeData?.data;

  return (
    <div className="mx-auto animate-fade p-4 px-8 lg:container">
      <div className="flex justify-between gap-x-7">
        <img
          src={data?.images.jpg.large_image_url}
          alt=""
          className="duration-400 h-96 w-72 animate-fade rounded-md object-cover transition-all ease-in-out"
        />
        <div className="flex-1 justify-start gap-y-0">
          <p className="font-space-mono text-xl font-medium opacity-90">
            {data?.title}
          </p>
          <p className="text font-space-mono font-medium opacity-60">
            {data?.title_english}
          </p>
          <div className="my-3 h-[1px] w-full bg-[#333]"></div> {/* Divider */}
          <div className="flex w-fit gap-x-2 pr-4 text-xs opacity-60">
            <p className="">{data?.type}</p>
            <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
            <p>{`${data?.episodes ? data?.episodes : "?"} episodes`}</p>
            <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
            <p>({data?.status})</p>
            <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
            <p className="text-xs opacity-60">
              {data && format(new Date(data?.aired.from), "MMMM yyyy")}
            </p>
            <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
            <p className="opacity-60">{data?.season}</p>
          </div>
          <div className="my-3 h-[1px] w-1/2 bg-[#333]"></div> {/* Divider */}
          <p className="font-space-mono text-sm tracking-wide opacity-55">
            {data?.synopsis}
          </p>
          <div className="mt-6 flex gap-x-5">
            <Link target="_blank" to={data?.url}>
              <Button size={"1"} variant="">
                MyAnimeList
              </Button>
            </Link>
            {data?.trailer.url && (
              <Link target="_blank" to={data?.trailer.url}>
                <Button size={"1"} color="red" variant="">
                  YouTube
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {!error && isLoadingEpisodes && (
        <div>
          <div className="m-1 flex cursor-pointer items-center justify-between border border-gray-700 p-3 font-space-mono transition-all duration-100 ease-in-out hover:bg-[#1e1e20]">
            <div className="flex flex-col gap-y-4">
              <Skeleton width={"10rem"} height={"1.3rem"} />
              <Skeleton width={"10rem"} height={"1.1rem"} />
            </div>
            <Skeleton width={"10rem"} />
          </div>
        </div>
      )}

      {animeEpisodes && animeEpisodes?.data?.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-x-3">
            <p className="font-space-mono text-lg font-medium opacity-90">
              Episodes
            </p>
            <Button
              size={"1"}
              onClick={() => setEnglishDub(!englishDub)}
              color={englishDub ? "blue" : "gray"}
            >
              English Dub
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-y-3">
            {animeEpisodes?.data.map((episode) => (
              <Episode
                key={episode.mal_id}
                anime={data.title}
                data={episode}
                englishDub={englishDub}
              />
            ))}
          </div>
        </div>
      )}

      {animeEpisodes && animeEpisodes?.data?.length === 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-x-3">
            <p className="font-space-mono text-lg font-medium opacity-90">
              Episodes
            </p>
            <Button
              size={"1"}
              onClick={() => setEnglishDub(!englishDub)}
              color={englishDub ? "blue" : "gray"}
            >
              English Dub
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-y-3">
            <Episode anime={data.title} englishDub={englishDub} />
          </div>
        </div>
      )}
    </div>
  );
}
