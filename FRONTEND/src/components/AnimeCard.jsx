import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function AnimeCard({ data }) {
  console.log(data);
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/anime/${data.mal_id}`);
  }

  return (
    <div
      onClick={() => handleClick()}
      className="m-4 flex w-48 cursor-pointer flex-col items-center justify-center gap-y-2 transition-all ease-in-out hover:scale-110"
    >
      <img
        src={data?.images.jpg.large_image_url}
        alt=""
        className="duration-400 h-60 w-40 animate-fade rounded-md object-cover transition-all ease-in-out"
      />
      <div className="flex w-[85%] flex-col gap-y-1">
        <div className="line-clamp-2 h-11 w-full text-sm font-medium opacity-90">
          {data.title}
        </div>

        <div className="flex justify-between text-xs opacity-60">
          <p className="">{format(new Date(data.aired.from), "MMMM yyyy")}</p>
          <p>{data.type}</p>
        </div>
        <div></div>
      </div>
    </div>
  );
}
