import { useState } from 'react'
import AniListLogo from '../assets/symbols/AniListLogo'
import { Button, DropdownMenu, Spinner, TextField } from '@radix-ui/themes'
import { setAnimeStatus, setWatchedEpisodes } from '../utils/helper'
import { toast } from 'sonner'
import { ExclamationTriangleIcon, MinusIcon, PlusIcon } from '@radix-ui/react-icons'

const status = {
  PLANNING: 'PLANNING',
  WATCHING: 'CURRENT',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  DROPPED: 'DROPPED',
  REPEATING: 'REPEATING'
}

function AnilistEditorModal({ anilist_data, setEpisodesWatchedMainPage }) {
  const [title, setTitle] = useState(
    anilist_data?.mediaListEntry?.status
      ? anilist_data?.mediaListEntry?.status[0].toUpperCase() +
          anilist_data?.mediaListEntry?.status?.slice(1).toLowerCase()
      : 'Add to AniList'
  )

  const [anilistModalOpen, setAnilistModalOpen] = useState(false)
  const [episodesWatched, setEpisodesWatched] = useState(
    anilist_data?.mediaListEntry?.progress || 0
  )
  const [updating, setUpdating] = useState(false)
  async function handleStatusChange(status) {
    setUpdating(true)
    const response = await setAnimeStatus(anilist_data.id, status)
    setUpdating(false)
    if (response?.status) {
      toast.success('AniList updated', {
        description: `Anime status updated to ${status}`,
        classNames: {
          title: 'text-green-500'
        }
      })
      setTitle(status[0].toUpperCase() + status.slice(1).toLowerCase())
    } else
      toast.error('AniList update failed', {
        description: 'AniList update failed',
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        classNames: {
          title: 'text-rose-500'
        }
      })
  }

  async function anilistEpisodeHandler(action) {
    let new_episode = episodesWatched
    const total_episodes = anilist_data?.episodes || 100000000
    if (!isNaN(action)) {
      if (action === episodesWatched) return
      if (action > total_episodes || action < 0) {
        toast.error('Invalid episode number', {
          description: 'Invalid episode number',
          icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
          classNames: {
            title: 'text-rose-500'
          }
        })
        return
      }
      new_episode = action
    }
    if (action === 'increase' && new_episode < total_episodes) {
      new_episode += 1
    } else if (action === 'increase' && new_episode >= total_episodes) {
      return
    }
    if (action === 'decrease' && new_episode > 0) {
      new_episode -= 1
    } else if (action === 'decrease' && new_episode <= 0) {
      return
    }
    try {
      setUpdating(true)
      const response = await setWatchedEpisodes(anilist_data.id, new_episode)
      if (setEpisodesWatchedMainPage) setEpisodesWatchedMainPage(new_episode)
      if (title === 'Add to AniList') {
        setTitle('Current')
      }
      setEpisodesWatched(new_episode)
      setUpdating(false)
    } catch (error) {
      toast.error('AniList update failed', {
        description: 'AniList update failed',
        icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
        classNames: {
          title: 'text-rose-500'
        }
      })

      console.error(error)
    }
  }

  return (
    <div className="font-space-mono">
      {anilist_data && (
        <div className="flex items-center gap-x-4">
          <div className="font-space-mono">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger>
                <Button
                  size={'1'}
                  variant=""
                  style={{
                    borderRadius: '0rem'
                  }}
                  onClick={() => setAnilistModalOpen(true)}
                >
                  <div className="flex items-center justify-center">
                    <div className="ml-[-8px] mr-2 gap-x-1 bg-slate-700 px-1">
                      <AniListLogo />
                    </div>
                    {title}
                  </div>
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {Object.keys(status).map((key) => (
                  <DropdownMenu.Item
                    key={key}
                    color="gray"
                    onSelect={() => {
                      handleStatusChange(status[key])
                    }}
                  >
                    {status[key][0].toUpperCase() + status[key].slice(1).toLowerCase()}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          <div className="flex border border-[#545454]">
            <Button
              size={'1'}
              color="gray"
              variant="soft"
              onClick={() => anilistEpisodeHandler('decrease')}
              style={{
                borderRadius: '0rem'
              }}
            >
              <MinusIcon width={'16px'} height={'16px'} />
            </Button>
            <div className="flex items-center">
              <TextField.Root
                placeholder="?"
                size={'1'}
                className="w-10"
                value={episodesWatched}
                onChange={(e) => setEpisodesWatched(e.target.value)}
                style={{
                  backgroundColor: 'transparent',
                  textAlign: 'right',
                  boxShadow: 'none'
                }}
                onBlur={() => {
                  // setEpisodesWatched(parseInt(episodesWatched))
                  anilistEpisodeHandler(parseInt(episodesWatched))
                }}
              ></TextField.Root>
              <p className="ml-2 mr-8 pb-[2.41px] text-xs">/ {anilist_data?.episodes || '?'}</p>
            </div>
            <Button
              size={'1'}
              color="gray"
              variant="soft"
              onClick={() => anilistEpisodeHandler('increase')}
              style={{
                borderRadius: '0rem'
              }}
            >
              <PlusIcon width={'16px'} height={'16px'} />
            </Button>
          </div>
          {updating && <Spinner />}
        </div>
      )}
    </div>
  )
}

export default AnilistEditorModal
