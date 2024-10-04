import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'

export default function SearchResults({ data, setIsActive }) {
  const navigate = useNavigate()
  function handleClick() {
    navigate(`/anime/${data.id}`)
    setIsActive(false)
  }
  const date = data?.startDate
    ? new Date(data.startDate.year, data.startDate.month - 1, data.startDate.day)
    : null

  return (
    <div
      onClick={() => handleClick()}
      className="hover:drop-shadow-xl flex animate-fade cursor-pointer gap-x-5 bg-[#111113] px-2 py-1 font-inter transition-all duration-200 ease-in-out hover:z-10 hover:scale-105 hover:rounded-md hover:bg-[#232326]"
    >
      <img
        className="duration-400 h-12 w-12 animate-fade rounded-lg object-cover transition-all ease-in-out hover:scale-150"
        src={data.coverImage.large}
        alt="img"
      />
      <div className="flex w-[85%] flex-col">
        <div className="w-full truncate text-sm font-medium opacity-80">{data.title.romaji}</div>

        <div>
          <p className="text-xs opacity-45">
            {data.format} - {`${data.episodes ? data.episodes : '?'} episodes`} ({data.status})
          </p>
          {date && <p className="text-xs opacity-45">{format(new Date(date), 'MMMM yyyy')}</p>}
        </div>
      </div>
    </div>
  )
}
