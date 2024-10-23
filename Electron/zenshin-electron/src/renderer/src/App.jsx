import { createHashRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './ui/AppLayout'
import Home from './pages/Home'
import ErrorPage from './pages/ErrorPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AnimePage from './pages/AnimePage'
import Player from './pages/Player'
import NewReleases from './pages/NewReleases'
import AnilistAuthCallback from './components/AnilistAuthCallback'
import Settings from './pages/Settings'
import AnimePahe from './extensions/animepahe/pages/AnimePahe'
import AnimePahePage from './extensions/animepahe/pages/AnimePahePage'
import AnimePahePlayer from './extensions/animepahe/pages/AnimePahePlayer'

// import { lazy } from "react";

// const AnimePage = lazy(() => import("./pages/AnimePage"));
// const Player = lazy(() => import("./pages/Player"));

const router = createHashRouter([
  {
    element: <AppLayout />,
    errorElement: <AppLayout props={<ErrorPage />} />,
    children: [
      {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />
      },
      {
        path: '/anime/:animeId',
        element: <AnimePage />,
        errorElement: <ErrorPage />
      },
      {
        path: '/player/:magnetId/:animeId?/:priorProgress?/:currentEpisodeNum?',
        element: <Player />,
        errorElement: <ErrorPage />
      },
      {
        path: '/newreleases',
        element: <NewReleases />,
        errorElement: <ErrorPage />
      },
      {
        path: '/anilistauthcallback',
        element: <AnilistAuthCallback />,
        errorElement: <ErrorPage />
      },
      {
        path: '/animepahe',
        element: <AnimePahe />,
        errorElement: <ErrorPage />
      },
      {
        path: '/animepahe/anime/:animeId',
        element: <AnimePahePage />,
        errorElement: <ErrorPage />
      },
      {
        path: '/animepahe/player/:videoSrc',
        element: <AnimePahePlayer />,
        errorElement: <ErrorPage />
      },
      {
        path: '/settings',
        element: <Settings />,
        errorElement: <ErrorPage />
      }
    ]
  }
])

function App() {
  // the idea of integrating react-query is similar to that of context api
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: 60 * 1000, // staleTime is the time in milliseconds after which the data is considered stale
        staleTime: 0
      }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
