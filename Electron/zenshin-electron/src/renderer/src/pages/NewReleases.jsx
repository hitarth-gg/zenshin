import { useEffect, useState } from 'react'
import useGetNewReleases from '../hooks/useGetNewReleases'
import CenteredLoader from '../ui/CenteredLoader'
import NewReleaseCard from '../components/NewReleaseCard'
import useGetMultipleAnilistIds from '../hooks/useGetMultipleAnilistIds'

export default function NewReleases() {
  const packer = '[SubsPlease]'
  const { isLoading, data, error, status } = useGetNewReleases(packer)
  const [newReleases, setNewReleases] = useState([])
  const [displayedReleases, setDisplayedReleases] = useState([])
  const [cardErrorShown, setCardErrorShown] = useState(false) // Track whether error toast was shown
  const [totalCards, setTotalCards] = useState(20);

  useEffect(() => {
    if (data) {
      const HQ_Releases = data.filter((release) => release.title.includes('1080p'))
      setNewReleases(HQ_Releases.slice(0, 12))
      //   setNewReleases(HQ_Releases);
      setDisplayedReleases(HQ_Releases.slice(0, totalCards))
    }
  }, [data])

  const [anilistIds, setAnilistIds] = useState([])

  const {
    isLoading: isLoadingAnilist,
    data: dataAnilist,
    error: errorAnilist
  } = useGetMultipleAnilistIds(anilistIds.length === totalCards ? anilistIds : [])

  console.log(anilistIds)

  // useEffect(() => {
  //   async function insertReleases() {
  //     const chunkSize = 5
  //     for (let i = 0; i < newReleases.length; i += chunkSize) {
  //       const chunk = newReleases.slice(i, i + chunkSize)
  //       for (let j = 0; j < chunk.length; j++) {
  //         await new Promise((resolve) => setTimeout(resolve, 300)) // 200ms delay between each insertion
  //         setDisplayedReleases((prev) => [...prev, chunk[j]])
  //       }
  //       if (i + chunkSize < newReleases.length) {
  //         await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds before next chunk
  //       }
  //     }
  //   }

  //   if (newReleases.length > 0) {
  //     insertReleases()
  //   }
  // }, [newReleases])

  console.log(anilistIds)

  if (isLoading) {
    return <CenteredLoader />
  }

  if (error) {
    throw new Error(error)
  }

  return (
    <div className="p-12">
      <div className="border-b border-gray-700 pb-3 font-space-mono text-lg tracking-wider">
        New Releases
      </div>
      <div className="grid animate-fade grid-cols-4">
        {displayedReleases.map((release) => (
          <NewReleaseCard
            key={release.title}
            data={release}
            cardErrorShown={cardErrorShown}
            setCardErrorShown={setCardErrorShown}
            anilistIds={anilistIds}
            setAnilistIds={setAnilistIds}
            dataAnilist={dataAnilist}
            totalCards={totalCards}
            setTotalCards={setTotalCards}
          />
        ))}
      </div>
    </div>
  )
}
