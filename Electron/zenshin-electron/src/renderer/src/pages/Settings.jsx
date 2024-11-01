import { Checkbox, Flex, Switch, TextField } from '@radix-ui/themes'
import { useZenshinContext } from '../utils/ContextProvider'

export default function Settings() {
  const {
    glow,
    setGlow,
    vlcPath,
    setVlcPath,
    autoUpdateAnilistEpisode,
    setAutoUpdateAnilistEpisode
  } = useZenshinContext()

  function toggleGlow() {
    const newGlowState = !glow // Determine the new state
    setGlow(newGlowState) // Update context state
    localStorage.setItem('glow', newGlowState ? 'true' : 'false') // Update localStorage correctly
  }

  function updateVlcPath(e) {
    const newPath = e.target.value
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

  return (
    <div className="w-screen select-none px-16 py-10 font-space-mono">
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
        This app or it's servers do not host or distribute any copyrighted files or media. It is an
        educational project built solely to learn about new technologies.
      </p>
    </div>
  )
}
