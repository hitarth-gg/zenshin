import animeGif from '../assets/anime.gif'
import { BarLoader } from 'react-spinners'
export default function Loader() {
  return (
    <div className="flex h-fit w-fit flex-col items-center justify-center gap-y-1">
      <img className="w-36" src={animeGif} alt="" />

      <div className="relative right-3 mt-2">
        {/* <l-line-wobble
          size="80"
          stroke="5"
          bg-opacity="0.1"
          speed="1.75"
          color="#e5bc94"
        ></l-line-wobble> */}
        <BarLoader color="#e5bc94" />
      </div>
    </div>
  )
}
