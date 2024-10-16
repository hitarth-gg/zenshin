import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'
import zenshinLogo from '../assets/zenshinLogo.png'
import {
  Cross1Icon,
  DividerVerticalIcon,
  ExclamationTriangleIcon,
  GitHubLogoIcon,
  LayersIcon,
  LightningBoltIcon,
  MinusIcon,
  PersonIcon,
  ShadowIcon,
  ShadowNoneIcon,
  SquareIcon
} from '@radix-ui/react-icons'
import { Button, DropdownMenu, Tooltip } from '@radix-ui/themes'
import { useZenshinContext } from '../utils/ContextProvider'
import { anilistAuthUrl } from '../utils/auth'
import { ANILIST_CLIENT_ID } from '../utils/auth'
import { useEffect, useState } from 'react'
import useGetAnilistProfile from '../hooks/useGetAnilistProfile'
import { toast } from 'sonner'
import axios from 'axios'

export default function Header({ theme }) {
  const zenshinContext = useZenshinContext()
  function toggleGlow() {
    zenshinContext.setGlow(!zenshinContext.glow)
  }

  const checkBackendRunning = async () => {
    try {
      const response = await axios.get('http://localhost:64621/ping')
      console.log(response)

      if (response.status === 200) {
        toast.success('Backend is running', {
          icon: <LightningBoltIcon height="16" width="16" color="#ffffff" />,
          description: 'Backend is running on your local machine',
          classNames: {
            title: 'text-green-500'
          }
        })
      }
    } catch (error) {
      toast.error('Backend is not running', {
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        description: 'Backend is not running on your local machine',
        classNames: {
          title: 'text-rose-500'
        }
      })

      console.error('Error checking if the backend is running', error)
    }
  }

  /* -------------------- ANILIST AUTH -------------------- */
  const [anilistToken, setAnilistToken] = useState(localStorage.getItem('anilist_token') || '')

  useEffect(() => {
    console.log('useEffect')

    window.electron.receiveDeeplink((deeplink) => {
      // console.log('Deeplink received in React app:', link)
      const arr = deeplink.split('#')
      const hash = arr[1]
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')

      if (accessToken) {
        // Store the access token in local storage
        localStorage.setItem('anilist_token', accessToken)
        // refresh the page
        window.location.reload()
      }
    })
  }, [])

  const {
    isLoading,
    data: userProfile,
    error: userProfileError,
    status
  } = useGetAnilistProfile(anilistToken)

  console.log('anilistToken: ', anilistToken)

  const handleLogin = () => {
    // window.location.href = anilistAuthUrl
    // shell.openExternal(anilistAuthUrl)
    window.api.oauth(anilistAuthUrl)
  }

  const handleLogout = () => {
    localStorage.removeItem('anilist_token')
    localStorage.removeItem('anilist_id')
    localStorage.removeItem('anilist_name')
    setAnilistToken('')

    // refresh the page
    window.location.reload()
  }

  if (userProfileError) {
    toast.error('Error fetching Anilist Profile', {
      description: userProfileError?.message,
      classNames: {
        title: 'text-rose-500'
      }
    })
  }

  return (
    <div className="draggable sticky top-0 z-20 flex h-11 items-center justify-between border-[#5a5e6750] bg-[#111113] bg-opacity-60 px-4 py-3 backdrop-blur-md">
      <div className="nodrag flex items-center justify-center gap-x-2">
        <Link
          className="nodrag hover: font-spaceMono flex w-fit cursor-pointer select-none gap-x-2 rounded-sm p-1 text-sm transition-all duration-200 hover:bg-[#70707030]"
          to={'/'}
        >
          <img src={zenshinLogo} alt="" className="w-16" />
        </Link>
        <DividerVerticalIcon width={20} height={20} color="#ffffff40" />
        <a className="nodrag" href="https://github.com/hitarth-gg" target="_blank" rel="noreferrer">
          <Button color="gray" variant="ghost" size={'1'}>
            <GitHubLogoIcon className="my-1" width={17} height={17} />
          </Button>
        </a>
        <DividerVerticalIcon width={20} height={20} color="#ffffff40" />
        <Button className="nodrag" color="gray" variant="ghost" size={'1'}>
          <Link to="/newreleases">
            {/* <div className="p-1 font-space-mono text-[.8rem]">New Releases</div> */}
            <div className="p-1 font-space-mono text-[.8rem]">New</div>
          </Link>
        </Button>
        <DividerVerticalIcon width={20} height={20} color="#ffffff40" />
        <Tooltip content="Ping Backend">
          <Button
            className="nodrag"
            size="1"
            color="green"
            variant="soft"
            onClick={checkBackendRunning}
          >
            <LayersIcon />
          </Button>
        </Tooltip>
      </div>

      <div className="nodrag w-2/6">
        <SearchBar />
      </div>
      <div className="nodrag mr-36 flex items-center justify-center gap-x-8">
        {!anilistToken && (
          <Tooltip content="Login With Anilist">
            <Button color="gray" variant="ghost" size={'1'} onClick={handleLogin}>
              <PersonIcon className="my-1" width={16} height={16} />
            </Button>
          </Tooltip>
        )}
        {userProfile && (
          <DropdownMenu.Root className="nodrag" modal={false}>
            <DropdownMenu.Trigger>
              <Button variant="ghost" color="gray">
                <div className="flex animate-fade items-center gap-x-2">
                  <img
                    src={userProfile.avatar.large}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="font-space-mono text-[.8rem]">{userProfile.name}</div>
                </div>
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
                  <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Item color="red" onClick={handleLogout}>
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}

        {/* <Link target="_blank" to="https://github.com/hitarth-gg/zenshin"> */}
        {/* <Button color="gray" variant="ghost" size={'1'}> */}
        {/* <div className="p-1 text-[.8rem]">How to use</div> */}
        {/* </Button> */}
        {/* </Link> */}
        <Button
          className="nodrag"
          color="gray"
          variant="ghost"
          size={'1'}
          onClick={() => toggleGlow()}
        >
          {zenshinContext.glow ? (
            <ShadowIcon className="my-1" width={16} height={16} />
          ) : (
            <ShadowNoneIcon className="my-1" width={16} height={16} />
          )}
        </Button>
        {/* <div className="w-32"></div> */}
      </div>
    </div>
  )
}
