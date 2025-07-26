import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Code, Skeleton, TextField } from '@radix-ui/themes'
import { useEffect, useRef, useState } from 'react'
import useGetAnimePaheSearch from '../hooks/useGetAnimePaheSearch'
import AnimePaheSearchResults from './AnimePaheSearchResults'
// import Pikacon from '../../../assets/pikacon.ico'

export default function AnimePaheSearchBar() {
  const [searchText, setSearchText] = useState('')
  const [isActive, setIsActive] = useState(false)

  const inputRef = useRef(null)
  const searchBarRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsActive(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchBarRef])

  const { data: searchData, error, isLoading, status } = useGetAnimePaheSearch(searchText)

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        inputRef.current.select()
        inputRef.current.focus()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [searchText])

  return (
    <div ref={searchBarRef} className="relative z-10">
      <TextField.Root
        placeholder={'Search on animepahe...'}
        onInput={(e) => setSearchText(e.target.value)}
        ref={inputRef}
        type="text"
        value={searchText}
        onFocus={() => setIsActive(true)}
        // onBlur={() => setIsActive(false)}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
        <TextField.Slot className="transition-all duration-100 ease-in-out hover:cursor-pointer hover:bg-[#5a5e6750]">
          <Code size={'1'} color="gray" variant="outline">
            ctrl
          </Code>
          <Code size={'1'} color="gray" variant="outline">
            k
          </Code>
        </TextField.Slot>
      </TextField.Root>

      {isActive && (
        <div className="absolute mt-1 flex w-full animate-fade-down flex-col justify-center rounded-sm animate-duration-[400ms]">
          {/* {true && ( */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-y-5 bg-[#111113] p-2 backdrop-blur-sm">
              <div className="flex w-full items-start gap-x-4">
                <Skeleton className="h-12 w-12" />
                <div className="flex flex-col gap-y-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2 w-48" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
              {/* <Spinner /> */}
            </div>
          )}

          {searchData?.data?.map((x) => (
            <AnimePaheSearchResults key={x.id} data={x} setIsActive={setIsActive} />
          ))}
        </div>
      )}
    </div>
  )
}
