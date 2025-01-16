import { Button, Checkbox, Flex, Switch, TextField } from '@radix-ui/themes'
import { useZenshinContext } from '../utils/ContextProvider'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Settings() {
  const {
    glow,
    setGlow,
    vlcPath,
    setVlcPath,
    autoUpdateAnilistEpisode,
    setAutoUpdateAnilistEpisode,
    scrollOpacity,
    setScrollOpacity,
    hideHero,
    setHideHero,
    checkForUpdates,
    setCheckForUpdates,
    backendPort,
    setBackendPort,
    broadcastDiscordRpc,
    setBroadcastDiscordRpc,
    hoverCard,
    setHoverCard,
    settings,
    setSettings
  } = useZenshinContext()

  // const [settingsJson, setSettingsJson] = useState({})
  const [tempBackendPort, setTempBackendPort] = useState(backendPort)

  function toggleGlow() {
    const newGlowState = !glow // Determine the new state
    setGlow(newGlowState) // Update context state
    localStorage.setItem('glow', newGlowState ? 'true' : 'false') // Update localStorage correctly
  }

  function updateVlcPath(e) {
    // replace double quotes with empty string
    const newPath = e.target.value.replace(/"/g, '')
    setVlcPath(`"${newPath}"`)
    localStorage.setItem('vlcPath', newPath)
  }

  function toggleAutoUpdateAnilistEpisode() {
    const newAutoUpdateAnilistEpisodeState = !autoUpdateAnilistEpisode
    setAutoUpdateAnilistEpisode(newAutoUpdateAnilistEpisodeState)
    localStorage.setItem(
      'autoUpdateAnilistEpisode',
      newAutoUpdateAnilistEpisodeState ? 'true' : 'false'
    )
  }

  function toggleScrollOpacity() {
    const newScrollOpacityState = !scrollOpacity
    setScrollOpacity(newScrollOpacityState)
    localStorage.setItem('scrollOpacity', newScrollOpacityState ? 'true' : 'false')
  }

  function toggleHideHero() {
    const newHideHeroState = !hideHero
    setHideHero(newHideHeroState)
    localStorage.setItem('hideHero', newHideHeroState ? 'true' : 'false')
    if (newHideHeroState === true) {
      localStorage.setItem('scrollOpacity', 'false')
      setScrollOpacity(false)
    }
  }

  function toggleCheckForUpdates() {
    const newCheckForUpdatesState = !checkForUpdates
    setCheckForUpdates(newCheckForUpdatesState)
    localStorage.setItem('checkForUpdates', newCheckForUpdatesState ? 'true' : 'false')
  }

  // async function getSettingsJson() {
  //   let data = await window.api.getSettingsJson()
  //   setSettingsJson(data)
  // }

  async function changeDownloadsFolder() {
    let data = await window.api.changeDownloadsFolder()
    // setSettingsJson(data)
    setSettings(data)
  }

  function toggleHoverCard() {
    const newHoverCardState = !hoverCard
    setHoverCard(newHoverCardState)
    localStorage.setItem('hoverCard', newHoverCardState ? 'true' : 'false')
  }

  // useEffect(() => {
  //   getSettingsJson()
  // }, [])

  console.log(settings)

  return (
    <div className="w-full animate-fade select-none px-16 py-10 font-space-mono animate-duration-500">
      <div className="mb-8 border-b border-gray-700 pb-2 font-semibold tracking-wider text-[#b5b5b5ff]">
        Settings
      </div>

      <div className="flex flex-col gap-4 tracking-wide text-[#b5b5b5ff]">
        <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
          <div className="switch_card">
            <p className="font-bold">Glow Effect</p>
            <p className="text-xs">
              Enable or disable the glow effect surrounding banners, as well as the hover-triggered
              glow effect on anime cards.
            </p>
          </div>
          <Switch
            checked={glow}
            style={{ marginLeft: '1.5rem', cursor: 'pointer' }}
            onCheckedChange={toggleGlow}
          />
        </div>

        <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
          <div className="switch_card">
            <p className="font-bold">Auto Update Episodes on Anilist</p>
            <p className="text-xs">
              If turned on, Zenshin will automatically update the episode on Anilist when more than
              80% of the episode is watched.
            </p>
          </div>
          <Switch
            checked={autoUpdateAnilistEpisode}
            style={{ marginLeft: '1.5rem', cursor: 'pointer' }}
            onCheckedChange={toggleAutoUpdateAnilistEpisode}
          />
        </div>

        <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
          <div className="switch_card">
            <p className="font-bold">Scroll Opacity</p>
            <p className="text-xs">
              Turn on scroll opacity effect on the home page. Turning it <b>off</b> will slightly{' '}
              <b>improve performance</b>.
            </p>
          </div>
          <Switch
            checked={scrollOpacity}
            style={{ marginLeft: '1.5rem', cursor: 'pointer' }}
            onCheckedChange={toggleScrollOpacity}
          />
        </div>

        <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
          <div className="switch_card">
            <p className="font-bold">Hide Hero on Home Page</p>
            <p className="text-xs">
              Hide the hero section on the home page. Turning it on will disable the scroll opacity
              effect.
            </p>
          </div>
          <Switch
            checked={hideHero}
            style={{ marginLeft: '1.5rem', cursor: 'pointer' }}
            onCheckedChange={toggleHideHero}
          />
        </div>
        <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
          <div className="switch_card">
            <p className="font-bold">Modal popup when hovering over anime cards</p>
            <p className="text-xs">
              Enable or disable the modal popup when hovering over anime cards. <br /> Disabling
              this will slightly <b>improve performance</b> and reduce scroll lag.
            </p>
          </div>
          <Switch
            checked={hoverCard}
            style={{ marginLeft: '1.5rem', cursor: 'pointer' }}
            onCheckedChange={toggleHoverCard}
          />
        </div>
        <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
          <div className="switch_card">
            <p className="font-bold">Check for Updates on App Launch</p>
            <p className="text-xs">
              If turned on, Zenshin will automatically check for updates on app launch and notify
              you if a new version is available.
            </p>
          </div>
          <Switch
            checked={checkForUpdates}
            style={{ marginLeft: '1.5rem', cursor: 'pointer' }}
            onCheckedChange={toggleCheckForUpdates}
          />
        </div>

        <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
          <div className="text_input_card">
            <p className="font-bold">External Media Player Path</p>
            <p className="text-xs">Set the path to the executable file of external media player.</p>
            <p className="text-xs">Current Path: {vlcPath}</p>
          </div>
          <TextField.Root
            placeholder={vlcPath}
            value={vlcPath.replace(/"/g, '')}
            onInput={updateVlcPath}
            className="w-1/2"
          ></TextField.Root>
        </div>

        <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
          <div className="button_card">
            <p className="font-bold">Change Torrent Download Location</p>
            <p className="text-xs">Change the default download location of torrent files.</p>
            <p className="text-xs">Current path: &quot;{settings.downloadsFolderPath}&quot;</p>
          </div>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              changeDownloadsFolder()
            }}
          >
            Change Download Folder
          </Button>
        </div>
        {/* Form with input */}

        <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
          <div className="">
            <p className="font-bold">Change Backend Port</p>
            <p className="text-xs">
              Change the port of the backend server. <b className="tracking-wider">Re-Launch</b> the
              app after changing port and Refresh the cookies.
              <br />
              Do not change the port unnecessarily.
            </p>
            <p className="text-xs">
              Current port: <b className="tracking-wider">{backendPort}</b>
            </p>
          </div>

          <div className="flex w-fit">
            <TextField.Root
              placeholder={backendPort}
              type="number"
              value={tempBackendPort}
              onInput={(e) => setTempBackendPort(e.target.value)}
              className="w-24"
              style={{
                borderRadius: '0.25rem 0 0 0.25rem'
              }}
            ></TextField.Root>

            <Button
              variant="outline"
              color="gray"
              onClick={() => {
                setBackendPort(tempBackendPort)
                window.api.changeBackendPort(tempBackendPort)
                toast.success('Backend port changed to ' + tempBackendPort)
                // window.api.changeBackendPort(64622)
              }}
              style={{
                borderRadius: '0 0.25rem 0.25rem 0',
                // boxShadow: '0 0 1px 0px #4863bd'
                boxShadow: 'none',
                border: '1px solid #4e5359',
                borderLeft: '0px'
              }}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
          <div className="switch_card">
            <p className="font-bold">Discord RPC</p>
            <p className="text-xs">Broadcast your activity on Zenshin to Discord.</p>
          </div>
          <Switch
            checked={broadcastDiscordRpc}
            style={{ marginLeft: '1.5rem', cursor: 'pointer' }}
            onCheckedChange={() => {
              setBroadcastDiscordRpc(!broadcastDiscordRpc)
              window.api.broadcastDiscordRpc(!broadcastDiscordRpc)
            }}
          />
        </div>
      </div>

      <div className="keyboard_shortcuts mt-8">
        <div className="mb-8 border-b border-gray-700 pb-2 font-semibold tracking-wider text-[#b5b5b5ff]">
          Keyboard Shortcuts
        </div>
        <div className="flex flex-col gap-4 tracking-wide text-[#b5b5b5ff]">
          <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
            <div className="switch_card">
              <p className="font-bold">Alt + Arrow Left/Right</p>
              <p className="text-xs">Navigate between pages using Alt + Arrow Left/Right</p>
            </div>
          </div>
          {/* <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
            <div className="switch_card">
              <p className="font-bold">Ctrl + R</p>
              <p className="text-xs">Refresh the page using Ctrl + R</p>
            </div>
          </div> */}
          <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
            <div className="switch_card">
              <p className="font-bold">Ctrl + K</p>
              <p className="text-xs">Focus on the search bar using Ctrl + K</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-between bg-[#202022] px-4 py-2">
            <div className="switch_card">
              <p className="font-bold">Arrow Left/Right</p>
              <p className="text-xs">Seek video by 5s using Arrow Left/Right</p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-8 text-xs opacity-45">
        This app or it&apos;s servers do not host or distribute any copyrighted files or media. It
        is an educational project built solely to learn about new technologies.
      </p>
    </div>
  )
}
