import React from "react";
import "ldrs/lineWobble";
import animeGif from "../assets/anime.gif";
export default function Loader() {
  return (
    <div className="w-fit h-fit flex flex-col items-center justify-center gap-y-1">
      <img className="w-36" src={animeGif} alt="" />

      <div className="relative right-2">
        <l-line-wobble
          size="80"
          stroke="5"
          bg-opacity="0.1"
          speed="1.75"
          color="#e5bc94"
        ></l-line-wobble>
      </div>
    </div>
  );
}
