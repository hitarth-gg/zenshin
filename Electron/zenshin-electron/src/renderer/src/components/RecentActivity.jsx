import { useScroll, motion, useTransform } from 'framer-motion'
import RecentActivityCard from './RecentActivityCard'

export default function RecentActivity({ data }) {
  const { scrollY } = useScroll()

  const yTop = useTransform(scrollY, [0, 1000], [0, -360])
  const yBottom = useTransform(scrollY, [0, 800], [0, 360])

  return (
    <div className="tripp relative my-4 flex h-[30rem] w-2/6 min-w-[30rem] gap-x-2 overflow-hidden">
      {/* Only render gradients if scrollY is less than 900 */}
      <motion.div className="absolute -top-[16rem] left-0 w-full" style={{ y: yTop }}>
        <div className="flex flex-col">
          {data.slice(0, 3).map((item, index) => (
            <RecentActivityCard key={index} data={item} />
          ))}
        </div>
      </motion.div>
      <motion.div className="absolute -top-[25rem] left-1/2 w-full" style={{ y: yBottom }}>
        <div className="flex flex-col">
          {data.slice(3, 6).map((item, index) => (
            <RecentActivityCard key={index + 3} data={item} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
