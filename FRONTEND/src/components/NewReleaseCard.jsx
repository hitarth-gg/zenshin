import { useNavigate } from "react-router-dom";
import {
  parseISO,
  differenceInMinutes,
  differenceInSeconds,
  differenceInHours,
} from "date-fns";
import { useEffect, useState } from "react";
import { searchAiringAnime } from "../utils/helper";
import useGetAniZipMappings from "../hooks/useGetAniZipMappings";
import { Skeleton } from "@radix-ui/themes";
import { toast } from "sonner";

const tempImg =
  "https://artworks.thetvdb.com/banners/v4/episode/10166490/screencap/6685897a8dc6c.jpg";

function timeAgo(dateString) {
  // Parse the date string
  const pastDate = new Date(dateString);
  const now = new Date();

  // Calculate differences
  const minutesAgo = differenceInMinutes(now, pastDate);
  const secondsAgo = differenceInSeconds(now, pastDate);
  const hoursAgo = differenceInHours(now, pastDate);

  // Format the output
  let result = `${secondsAgo} seconds ago`;
  if (minutesAgo >= 1) {
    result = `${minutesAgo} minutes ago`;
  }
  if (hoursAgo >= 1) {
    result = `${hoursAgo} hours ago`;
  }

  return result;
}

export default function NewReleaseCard({ data }) {
  const navigate = useNavigate();

  function handleClick() {
    // navigate(`/anime/${data.id}`, { state: { data } });
  }
  const filename = data?.title[0];
  const [anilistData, setAnilistData] = useState(null);

  let title = filename.slice(
    filename.indexOf("]") + 1,
    filename.lastIndexOf("-") - 1,
  );
  let episode = Number(
    filename.slice(filename.lastIndexOf("-") + 2, filename.indexOf("(") - 1),
  );

  const [anilistId, setAnilistId] = useState(null);

  useEffect(() => {
    async function fetchAnilistId() {
      try {
        const data = await searchAiringAnime(title);
        console.log(data);
        setAnilistData(data[0]);
        setAnilistId(data[0]?.id);
      } catch (error) {
        toast.error("Error fetching Anilist ID", {
          description: error?.message,
          classNames: {
            title: "text-rose-500",
          },
        });
        return;
      }
    }
    fetchAnilistId();
  }, [title]);

  const {
    isLoading: isLoadingMappings,
    data: mappingsData,
    error: errorMappings,
    status: statusMappings,
  } = useGetAniZipMappings(anilistId);

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!mappingsData) return;
    let episodesObj = mappingsData?.episodes;
    // convert episodes object to array
    let episodesArr = Object.keys(episodesObj).map((key) => episodesObj[key]);
    console.log(episodesArr);

    for (let i = 0; i < episodesArr.length; i++) {
      if (
        episode === episodesArr[i].episodeNumber ||
        episode === episodesArr[i].absoluteEpisodeNumber
      ) {
        setImageUrl(episodesArr[i].image);
        break;
      }
    }
  }, [episode, mappingsData]);

  if (errorMappings) {
    toast.error("Error fetching AniZip Mappings", {
      description: errorMappings?.message,
      classNames: {
        title: "text-rose-500",
      },
    });
  }

  return (
    <div
      onClick={() => handleClick()}
      className="m-4 flex animate-fade cursor-pointer flex-col items-center justify-center gap-y-2 transition-all ease-in-out hover:scale-110"
    >
      <div className="h-42 aspect-video w-full">
        {(imageUrl || anilistData?.coverImage?.extraLarge) && (
          <img
            src={imageUrl || anilistData?.coverImage?.extraLarge}
            alt="episode_image"
            className="duration-400 h-42 aspect-video animate-fade rounded-sm object-cover transition-all ease-in-out"
          />
        )}
        {!(imageUrl || anilistData?.coverImage?.extraLarge) && (
          <Skeleton className="h-full w-full" />
        )}
      </div>
      <div className="flex w-full flex-col gap-y-1">
        <div className="w-full truncate text-sm font-medium opacity-90">
          {title}
        </div>

        <div className="flex justify-between text-xs opacity-60">
          <p className="text-nowrap">{timeAgo(data.pubDate[0])}</p>
          <p className="text-nowrap">Episode {episode}</p>
        </div>
        <div></div>
      </div>
    </div>
  );
}
