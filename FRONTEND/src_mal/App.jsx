import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AnimePage from "./pages/AnimePage";
import Player from "./pages/Player";

const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      errorElement: <AppLayout props={<ErrorPage />} />,
      children: [
        {
          path: "/",
          element: <Home />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/anime/:animeId",
          element: <AnimePage />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/player/:magnetId",
          element: <Player />,
          errorElement: <ErrorPage />,
        }
        
      ],
    },
  ],
  {
    basename: "/zenshin",
  },
);

function App() {

  // the idea of integrating react-query is similar to that of context api
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000, // staleTime is the time in milliseconds after which the data is considered stale
      staleTime: 0,
    },
  },
});


  return (
    <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
      </QueryClientProvider>
  );
}

export default App;
