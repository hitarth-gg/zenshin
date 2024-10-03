import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function AnimeCard({ data }) {
  // console.log(data);
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/anime/${data.id}`, { state: { data } });
  }

  const date = data?.startDate
    ? new Date(
        data.startDate.year,
        data.startDate.month - 1,
        data.startDate.day,
      )
    : null;

  return (
    <div
      onClick={() => handleClick()}
      className="m-4 flex w-48 cursor-pointer flex-col items-center justify-center gap-y-2 transition-all ease-in-out hover:scale-110"
    >
      <img
        src={data?.coverImage?.extraLarge}
        alt=""
        className="duration-400 h-60 w-40 animate-fade rounded-md object-cover transition-all ease-in-out"
      />
      <div className="flex w-[85%] flex-col gap-y-1">
        <div className="line-clamp-2 h-11 w-full text-sm font-medium opacity-90">
          {data?.title?.romaji}
        </div>

        <div className="flex justify-between text-xs opacity-60">
          <p className="">{date && format(new Date(date), "MMMM yyyy")}</p>
          <p>{data.format}</p>
        </div>
        <div></div>
      </div>
    </div>
  );
}
