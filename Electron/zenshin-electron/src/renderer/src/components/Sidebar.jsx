import { Button } from '@radix-ui/themes'
import AniListLogo from '../assets/symbols/AniListLogo'
import { Link, useNavigate } from 'react-router-dom'
import Pikacon from '../assets/pikacon.ico'

function Sidebar() {
  const navigate = useNavigate()
  return (
    <div className="sidebar fixed flex h-full z-50 w-12 flex-col px-2">
      <div className="flex flex-col justify-center gap-y-5">
        <Button className="nodrag" color="gray" variant="soft" size={'1'}>
          <Link to="/newreleases">
            {/* <div className="p-1 font-space-mono text-[.8rem]">New Releases</div> */}
            <div className="font-space-mono text-[.8rem]">New</div>
          </Link>
        </Button>
        {/* <DividerVerticalIcon width={20} height={20} color="#ffffff40" /> */}
        {/* <Tooltip content="Ping Backend">
          <Button
            className="nodrag"
            size="1"
            color="green"
            variant="soft"
            onClick={checkBackendRunning}
          >
            <LayersIcon />
          </Button>
        </Tooltip> */}
        <Button
          className="nodrag"
          size="1"
          color="gray"
          variant="soft"
          onClick={() => navigate('/animepahe')}
        >
          {/* <DashboardIcon /> */}
          <img src={Pikacon} alt="pikacon" className="h-4 w-4" />
        </Button>

        {/* <DividerVerticalIcon width={20} height={20} color="#ffffff40" /> */}

        <Button
          className="nodrag"
          size="1"
          color="gray"
          variant="soft"
          onClick={() => navigate('/anilist')}
          style={{
            padding: '0 .4rem'
          }}
        >
          {/* <DashboardIcon /> */}
          <AniListLogo style="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
