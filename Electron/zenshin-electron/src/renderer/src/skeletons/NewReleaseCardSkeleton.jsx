import { Skeleton } from '@radix-ui/themes'

export default function NewReleaseCardSkeleton() {
  return (
    <div className="h-42 m-4 aspect-video">
      <Skeleton
        as="div"
        className="duration-400 aspect-video h-full flex-grow rounded-sm transition-all ease-in-out"
      />
      <div className="flex flex-col gap-y-1">
        <Skeleton as="div" className="mt-2 h-3 w-40" />
        <Skeleton as="div" className="h-3 w-20" />
      </div>
    </div>
  )
}
