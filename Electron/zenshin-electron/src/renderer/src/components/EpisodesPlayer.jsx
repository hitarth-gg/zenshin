import { Button } from '@radix-ui/themes'
import { useState } from 'react'

export default function EpisodesPlayer({
  file,
  handleStreamBrowser,
  handleStreamVlc,
  stopEpisodeDownload,
  setCurrentEpisode
}) {
  const [isActive, setIsActive] = useState(false)

  return (
    <div
      onClick={() => setIsActive(!isActive)}
      className="relative m-2 animate-fade-down cursor-default border border-gray-700 p-2 font-space-mono transition-all duration-100 ease-in-out animate-duration-500 hover:bg-[#1e1e20]"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-x-1 font-space-mono font-medium opacity-90">
          <div>
            <p className="flex gap-x-2 font-space-mono text-sm font-medium text-gray-400 opacity-90">
              <span className="flex items-center gap-2"></span>
              {file.name}
            </p>
            {isActive && (
              <div className="ml-2 mt-2 flex animate-fade-down gap-x-3 animate-duration-500">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentEpisode(file.name)
                    handleStreamBrowser(file.name)
                  }}
                  size="1"
                  color="violet"
                  variant="soft"
                  type="submit"
                >
                  Stream on App
                </Button>
                <Button
                  size="1"
                  color="mint"
                  variant="soft"
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentEpisode(file.name)
                    handleStreamVlc(file.name)
                  }}
                >
                  Open in External Player
                </Button>
                <Button
                  size="1"
                  color="red"
                  variant="soft"
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentEpisode('')
                    stopEpisodeDownload(file.name)
                  }}
                >
                  Stop downloading the episode
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
