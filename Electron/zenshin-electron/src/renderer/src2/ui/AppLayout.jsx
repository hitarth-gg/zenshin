import { Theme } from '@radix-ui/themes'
import { Outlet, useNavigate, useNavigation } from 'react-router-dom'
import Loader from './Loader'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import Header from '../components/Header'

export default function AppLayout({ props }) {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'
  const [theme, setTheme] = useState('dark')
  const navigate = useNavigate()

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // use escape key to go back to the previous page

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        navigate(-1)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [navigate])

  return (
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
  )
}
