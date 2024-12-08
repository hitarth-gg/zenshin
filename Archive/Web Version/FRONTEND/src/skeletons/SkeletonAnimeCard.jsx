import { Skeleton } from '@radix-ui/themes'

export default function SkeletonAnimeCard() {
  return (
    <div className="mt-6 gap-y-2 flex w-48 cursor-pointer flex-col items-center justify-center ">
      <Skeleton as="div" className=" h-60 w-40" />
      <div className="flex flex-col gap-y-1">
        <Skeleton as="div" className="h-3 mt-2 w-40" />
        <Skeleton as="div" className="h-3 w-20" />
      </div>
      <div className="flex flex-row justify-between mt-3 w-40">
        <Skeleton as="div" className="h-3 w-20" />
        <Skeleton as="div" className="h-3 w-10" />
      </div>
    </div>
  )
}
