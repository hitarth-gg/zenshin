import { format } from "date-fns";
import { SEARCH_TORRENT } from "../utils/api";
import useNyaaTracker from "../hooks/useNyaaTracker";
import { searchTorrent } from "../utils/helper";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Skeleton } from "@radix-ui/themes";

const data = {
  mal_id: 1,
  url: "https://myanimelist.net/anime/53580/Tensei_shitara_Slime_Datta_Ken_3rd_Season/episode/1",
  title: "Demons and Strategies",
  title_japanese: "悪魔と策謀",
  title_romanji: "Akuma to Sakubou ",
  aired: "2024-04-05T00:00:00+00:00",
  score: 4.3,
  filler: false,
  recap: false,
  forum_url: "https://myanimelist.net/forum/?topicid=2154196",
};

export default function Episode({ data, anime }) {
  //   const [torrentData, setTorrentData] = useState();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  const searchQuery = `${anime} ${data.mal_id < 10 ? `0${data.mal_id}` : data.mal_id}`;

  const {
    isLoading,
    torrents: torrentData,
    error,
    status,
  } = useNyaaTracker(active ? searchQuery : null);

  function handleClick() {
    if (active) {
      setActive(false);
      return;
    }
    setActive((prevActive) => !prevActive);
  }

  function onTorrentClick(torrent) {
    console.log(torrent);
    console.log(torrent.magnet);
    
    navigate(`/player/${encodeURIComponent(torrent.magnet)}`);
  }

  return (
    <div
      onClick={() => handleClick()}
      className="m-1 cursor-default border border-gray-700 p-3 font-space-mono transition-all duration-100 ease-in-out hover:bg-[#1e1e20]"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-x-1 font-space-mono font-medium opacity-90">
          <p className="text-lg">{data.mal_id}. </p>
          <div>
            <p className="font-space-mono text-lg font-medium opacity-90">
              {data.title}
            </p>
            <p className="font-space-mono font-medium opacity-60">
              {data.title_romanji}
            </p>
          </div>
        </div>
        <div className="flex w-fit gap-x-2 text-xs opacity-60">
          <p className="">{data.filler ? "Filler" : "Not Filler"}</p>
          <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
          <p>{data.recap ? "Recap" : "Not Recap"}</p>
          <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
          <p className="opacity-60">
            {format(new Date(data.aired), "dd MMMM yyyy")}
          </p>
          <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
          <p className="opacity-60">{data.score}</p>
        </div>
      </div>
      {active && (
        <div className="mt-3">
          {isLoading && <Skeleton width={"50%"} />}
          {error && (
            <p className="font-space-mono text-red-500">
              Error fetching torrents
            </p>
          )}
          {torrentData?.data?.map((torrent) => (
            <p key={torrent.title} onClick={() => onTorrentClick(torrent)} className="cursor-pointer font-space-mono text-sm tracking-wide opacity-55 hover:text-purple-400 hover:opacity-85">
              {torrent.title}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
