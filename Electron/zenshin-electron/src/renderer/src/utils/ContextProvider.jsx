import { createContext, useContext, useEffect, useState } from 'react'

const ZenshinContext = createContext()

export function useZenshinContext() {
  const context = useContext(ZenshinContext)
  if (context === undefined) {
    throw new Error('useZenshinContext must be used within a ZenshinProvider')
  }
  return context
}

export default function ZenshinProvider({ children }) {
  const [glow, setGlow] = useState(true)
  const [vlcPath, setVlcPath] = useState('"C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe"')
  const [autoUpdateAnilistEpisode, setAutoUpdateAnilistEpisode] = useState(true)
  const [scrollOpacity, setScrollOpacity] = useState(false)
  const [hideHero, setHideHero] = useState(false)
  const [userId, setUserId] = useState('')
  const [checkForUpdates, setCheckForUpdates] = useState(false)
  const [backendPort, setBackendPort] = useState(64621)
  const [broadcastDiscordRpc, setBroadcastDiscordRpc] = useState(false)
  const [hoverCard, setHoverCard] = useState(true)

  useEffect(() => {
    const glow = localStorage.getItem('glow')
    if (glow) {
      setGlow(glow === 'true')
    }

    const vlcPath = localStorage.getItem('vlcPath')
    if (vlcPath) {
      setVlcPath(vlcPath)
    }

    const autoUpdateAnilistEpisode = localStorage.getItem('autoUpdateAnilistEpisode')
    if (autoUpdateAnilistEpisode) {
      setAutoUpdateAnilistEpisode(autoUpdateAnilistEpisode === 'true')
    }

    const scrollOpacity = localStorage.getItem('scrollOpacity')
    if (scrollOpacity) {
      setScrollOpacity(scrollOpacity === 'true')
    }

    const hideHero = localStorage.getItem('hideHero')
    if (hideHero) {
      setHideHero(hideHero === 'true')
    }

    const updateCheck = localStorage.getItem('checkForUpdates')
    if (updateCheck) {
      setCheckForUpdates(updateCheck === 'true')
    }

    // getSettingsJson
    const getSettingsJson = async () => {
      const settings = await window.api.getSettingsJson()
      if (settings.backendPort) {
        setBackendPort(settings.backendPort)
      }
      if (settings.broadcastDiscordRpc) {
        setBroadcastDiscordRpc(settings.broadcastDiscordRpc)
      }
    }

    const animateHoverCard = localStorage.getItem('hoverCard')
    if (animateHoverCard) {
      setHoverCard(animateHoverCard === 'true')
    }

    getSettingsJson()
  }, [])

  return (
    <ZenshinContext.Provider
      value={{
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
        userId,
        setUserId,
        checkForUpdates,
        setCheckForUpdates,
        backendPort,
        setBackendPort,
        broadcastDiscordRpc,
        setBroadcastDiscordRpc,
        hoverCard,
        setHoverCard
      }}
    >
      {children}
    </ZenshinContext.Provider>
  )
}
