import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { act, create } from 'react-test-renderer'
import { describe, expect, it, vi } from 'vitest'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('../../hooks/useGetToshoEpisodes', () => ({
  default: () => ({ isLoading: false, data: null, error: null })
}))

import Episode from '../Episode'

describe('Episode', () => {
  it('settles when the all-episodes row has no cached AnimeTosho results', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
    let renderer

    expect(() => {
      act(() => {
        renderer = create(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <Episode
                all
                anime={{ romaji: 'Reliable Example' }}
                animeId={4242}
                data={{ quality: 'All', progress: 0 }}
                episodeNumber={0}
              />
            </MemoryRouter>
          </QueryClientProvider>
        )
      })
    }).not.toThrow()

    expect(JSON.stringify(renderer.toJSON())).toContain('Reliable Example')

    act(() => renderer.unmount())
    queryClient.clear()
    vi.unstubAllGlobals()
  })

  it('opens a cached fallback torrent and hands episode 11 to the player route', () => {
    navigateMock.mockReset()
    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
    const torrent = {
      title: '[SubsPlease] Reliable Example - 11 (1080p).mkv',
      magnet: 'magnet:?xt=urn:btih:episode11',
      seeders: 42,
      leechers: 3,
      downloads: 73,
      num_files: 1,
      size_bytes: 1024
    }
    let renderer

    act(() => {
      renderer = create(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Episode
              anime={{ romaji: 'Reliable Example' }}
              animeId={4242}
              data={{
                title: 'Episode 11',
                epNum: 11,
                quality: '1080p',
                progress: 4,
                toshoResults: [torrent]
              }}
              dualAudio={false}
              episodeNumber={11}
            />
          </MemoryRouter>
        </QueryClientProvider>
      )
    })

    const episodeToggle = renderer.root
      .findAllByType('div')
      .find((node) => node.props.className?.includes('h-full w-full cursor-default'))
    act(() => episodeToggle.props.onClick())
    expect(renderer.root.findAllByProps({ children: '73' })).toHaveLength(1)

    const torrentTitle = renderer.root.findByProps({ children: torrent.title })
    act(() => torrentTitle.parent.props.onClick())

    const pathname = `/player/${encodeURIComponent(torrent.magnet)}/4242/4/11`
    expect(navigateMock).toHaveBeenCalledOnce()
    expect(navigateMock).toHaveBeenCalledWith(pathname, {
      state: expect.objectContaining({
        pathname,
        state: expect.objectContaining({
          animeId: 4242,
          episodeNumber: 11,
          magnetUri: torrent.magnet
        })
      })
    })

    act(() => renderer.unmount())
    queryClient.clear()
    vi.unstubAllGlobals()
  })
})
