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
        setUserId
      }}
    >
      {children}
    </ZenshinContext.Provider>
  )
}
