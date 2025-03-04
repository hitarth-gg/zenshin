import { Button, Theme } from '@radix-ui/themes'
import { Link, Outlet, useNavigate, useNavigation } from 'react-router-dom'
import Loader from './Loader'
import { toast, Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { ReactLenis } from '@studio-freight/react-lenis'
import { DownloadIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import { useZenshinContext } from '../utils/ContextProvider'

export default function AppLayout({ props }) {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'
  const [theme, setTheme] = useState('dark')
  const { checkForUpdates, smoothScroll } = useZenshinContext()

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    console.log(theme)
  }

  // use alt + arrow keys to navigate between pages
  const navigate = useNavigate()
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'ArrowLeft') {
        navigate(-1)
      }
      if (e.altKey && e.key === 'ArrowRight') {
        navigate(1)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate])

  /* ------------- CHECK LATEST GITHUB RELEASE ------------ */
  const owner = 'hitarth-gg' // Replace with the repository owner
  const repo = 'zenshin' // Replace with the repository name
  const currentVersion = 'v2.1.8' // Replace with the current version

  const getLatestRelease = async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.tag_name !== currentVersion) {
        // console.log(chalk.blue('New version available:', data.tag_name))
        // console.log('Release notes:', data.body)
        // console.log(chalk.yellow('Download URL: https://github.com/hitarth-gg/zenshin/releases'))
        toast.success('New version available!', {
          // description: `Download the latest version from GitHub: ${data.html_url}`,
          description: (
            <div className="">
              Current version: <span className="font-semibold">{currentVersion}</span>
              <br />
              Latest version: <span className="font-semibold">{data.tag_name}</span>
              <br />
              <div className="mt-2">
                <Button
                  size={'1'}
                  color="green"
                  variant="soft"
                  onClick={() => window.open(`${data.html_url}`, '_blank')}
                >
                  <DownloadIcon className="mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ),
          icon: <GitHubLogoIcon />
        })
      }
    } catch (error) {
      console.error('Error fetching latest release:', error)
    }
  }

  useEffect(() => {
    if (checkForUpdates) getLatestRelease()
  }, [checkForUpdates])


  // const MainComponent = () => {
  //   return (
  //     <Theme appearance={theme}>
  //       <Toaster
  //         theme={theme}
  //         // richColors
  //         unstyled={false}
  //         toastOptions={{
  //           classNames: {
  //             error: 'bg-[#1c1317] border border-rose-500',
  //             success: 'bg-[#131c16] border border-green-500',
  //             icon: 'opacity-80',
  //             description: 'font-space-mono text-white opacity-90'
  //           }
  //         }}
  //       />
  //       <div
  //         className="layout flex flex-col font-inter"
  //         style={{
  //           direction: 'ltr'
  //         }}
  //       >
  //         {isLoading && <Loader />}
  //         <Header />
  //         <main className="">{props || <Outlet />}</main>
  //       </div>
  //     </Theme>
  //   )
  // }

  /* ------------------------------------------------------ */
  return (
    <>
      {/* {smoothScroll ? (
        <ReactLenis root options={{ lerp: 0.15 }}>
          <MainComponent />
        </ReactLenis>
      ) : (
        <MainComponent />
      )} */}
      {smoothScroll ? (
        <ReactLenis root options={{ lerp: 0.15 }}>
          <Theme appearance={theme}>
            <Toaster
              theme={theme}
              // richColors
              unstyled={false}
              toastOptions={{
                classNames: {
                  error: 'bg-[#1c1317] border border-rose-500',
                  success: 'bg-[#131c16] border border-green-500',
                  icon: 'opacity-80',
                  description: 'font-space-mono text-white opacity-90'
                }
              }}
            />
            <div
              className="layout flex flex-col font-inter"
              style={{
                direction: 'ltr'
              }}
            >
              {isLoading && <Loader />}
              <Header />
              <main className="">{props || <Outlet />}</main>
            </div>
          </Theme>
        </ReactLenis>
      ) : (
        <Theme appearance={theme}>
          <Toaster
            theme={theme}
            // richColors
            unstyled={false}
            toastOptions={{
              classNames: {
                error: 'bg-[#1c1317] border border-rose-500',
                success: 'bg-[#131c16] border border-green-500',
                icon: 'opacity-80',
                description: 'font-space-mono text-white opacity-90'
              }
            }}
          />
          <div
            className="layout flex flex-col font-inter"
            style={{
              direction: 'ltr'
            }}
          >
            {isLoading && <Loader />}
            <Header />
            <main className="">{props || <Outlet />}</main>
          </div>
        </Theme>
      )}
    </>
  )
}
