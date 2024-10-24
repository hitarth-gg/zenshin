import { TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Bookmarks() {
  // const bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem('bookmarks')) || {
      torrents: {},
      animepahe: {}
    }
  )
  console.log('bookmarks', bookmarks)

  const navigate = useNavigate()

  function removeBookmark(url) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {
      torrents: {},
      animepahe: {}
    }
    delete bookmarks.animepahe[url]
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }

  const BookmarkCardComponent = ({ data }) => {
    return (
      <div
        onClick={() => navigate(data.url)}
        className="group relative mt-6 flex w-48 cursor-pointer flex-col items-center justify-center gap-y-2 font-space-mono transition-all ease-in-out hover:scale-105"
      >
        <img
          src={data?.image}
          alt=""
          className="duration-400 z-10 h-60 w-40 animate-fade rounded-sm object-cover transition-all ease-in-out"
        />

        <div className="flex w-[85%] flex-col gap-y-1">
          <div className="z-10 line-clamp-2 h-11 w-full text-sm font-medium opacity-90">
            {data?.title}
          </div>

          <div className="flex items-center justify-between text-xs opacity-70">
            Episode: {data?.episodesWatched}
            <div className="">
              <Button
                color="gray"
                size={'1'}
                variant="soft"
                onClick={(e) => {
                  e.stopPropagation()
                  removeBookmark(data.url)
                  setBookmarks(JSON.parse(localStorage.getItem('bookmarks')))
                }}
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
          <div></div>
        </div>

        {/* FOR IMAGE GLOW */}
        {/* {glow && (
          <img
            src={data?.coverImage?.extraLarge}
            alt=""
            className="absolute top-0 z-0 h-60 w-40 rounded-md object-cover opacity-0 blur-2xl contrast-200 saturate-200 transition-all duration-500 ease-in-out group-hover:opacity-70"
          />
        )} */}
      </div>
    )
  }

  return (
    <div className="mx-5 mt-12">
      {Object.keys(bookmarks?.animepahe).length > 0 && (
        <>
          <div className="mb-2 ml-5 border-b border-gray-700 pb-1 font-space-mono text-lg font-bold tracking-wider">
            AnimePahe
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg2:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9">
            {bookmarks?.torrents &&
              Object.entries(bookmarks?.animepahe).map(([key, value]) => {
                return <BookmarkCardComponent key={value.url} data={value} />
              })}
          </div>
        </>
      )}
      {Object.keys(bookmarks?.torrents).length > 0 && (
        <>
          <div className="mb-2 ml-5 border-b border-gray-700 pb-1 font-space-mono text-lg font-bold tracking-wider">
            Torrents
          </div>
          <div>
            {bookmarks?.torrents &&
              Object.entries(bookmarks?.animepahe).map(([key, value]) => {
                return <BookmarkCardComponent key={value.url} data={value} />
              })}
          </div>
        </>
      )}
    </div>
  )
}

export default Bookmarks
