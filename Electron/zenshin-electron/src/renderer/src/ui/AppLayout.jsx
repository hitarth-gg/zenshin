import { Theme } from '@radix-ui/themes'
import { Outlet, useNavigate, useNavigation } from 'react-router-dom'
import Loader from './Loader'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { ReactLenis } from '@studio-freight/react-lenis'

export default function AppLayout({ props }) {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'
  const [theme, setTheme] = useState('dark')

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    console.log(theme)
  }

  // use alt + arrow keys to navigate between pages
  const navigate = useNavigate()
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'ArrowLeft') {
        navigate(-1)
      }
      if (e.altKey && e.key === 'ArrowRight') {
        navigate(1)
      }
    })
    return () => {
      document.removeEventListener('keydown', () => {})
    }
  }, [navigation])

  // use crtl + r to refresh the page
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'r') {
        window.location.reload()
      }
    })
    return () => {
      document.removeEventListener('keydown', () => {})
    }
  }, [])

  return (
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
        <div className="layout flex flex-col font-inter">
          {isLoading && <Loader />}
          <Header />
          <main className="">{props || <Outlet />}</main>
        </div>
      </Theme>
    </ReactLenis>
  )
}
