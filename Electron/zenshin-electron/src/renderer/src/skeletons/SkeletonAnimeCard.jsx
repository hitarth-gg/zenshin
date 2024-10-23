import { Skeleton } from '@radix-ui/themes'

export default function SkeletonAnimeCard() {
  return (
    <div className="mt-6 flex w-48 cursor-pointer flex-col items-center justify-center gap-y-2">
      <Skeleton as="div" className="h-60 w-40" />
      <div className="flex flex-col gap-y-1">
        <Skeleton as="div" className="mt-2 h-3 w-40" />
        <Skeleton as="div" className="h-3 w-20" />
      </div>
      <div className="mt-3 flex w-40 flex-row justify-between">
        <Skeleton as="div" className="h-3 w-20" />
        <Skeleton as="div" className="h-3 w-10" />
      </div>
    </div>
  )
}
