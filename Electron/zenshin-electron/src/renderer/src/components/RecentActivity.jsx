import { useEffect, useState } from 'react'
import RecentActivityCard from './RecentActivityCard'

export default function RecentActivity({ data }) {
  const [scrollY, setScrollY] = useState(0)

  // Update scrollY when the page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY) // Get current vertical scroll position
    }

    window.addEventListener('scroll', handleScroll)

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="tripp relative my-4 flex h-[30rem] w-2/6 min-w-[30rem] gap-x-2 overflow-hidden">
      {/* Top and bottom gradient for depth effect */}
      {scrollY < 900 && (
        <>
          {/* <div className="pointer-events-none absolute left-0 top-0 h-full w-full"> */}
          {/* <div className="absolute left-0 top-0 z-20 h-12 w-full bg-gradient-to-b from-[#111113] to-transparent"></div> */}
          {/* <div className="absolute bottom-0 left-0 z-20 h-12 w-full bg-gradient-to-t from-[#111113] to-transparent"></div> */}
          {/* </div> */}

          <div className={`absolute -top-[16rem] left-0 w-full`}>
            <div
              className="flex flex-col"
              style={{
                transform: `translateY(-${scrollY * 0.4}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {data.slice(0, 3).map((item, index) => (
                <RecentActivityCard key={index} data={item} />
              ))}
            </div>
          </div>
          <div className={`absolute -top-[25rem] left-1/2 w-full`}>
            <div
              className="flex flex-col"
              style={{
                transform: `translateY(${scrollY * 0.4}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {data.slice(3, 6).map((item, index) => (
                <RecentActivityCard key={index} data={item} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
