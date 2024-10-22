import { useEffect, useRef } from 'react'
import Hls from 'hls.js'
import Plyr from 'plyr-react'
import 'plyr-react/plyr.css'

const MyComponent = ({ videoSrc }) => {
  const ref = useRef(null)

  useEffect(() => {
    const loadVideo = async () => {
      const video = document.getElementById('plyr')
      const hls = new Hls()
      hls.loadSource(videoSrc)
      hls.attachMedia(video)

      if (ref.current) {
        ref.current.plyr.media = video
      }

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        ref.current.plyr.play()
      })
    }

    loadVideo()

    const handleKeyDown = (event) => {
      if (ref.current && ref.current.plyr) {
        const player = ref.current.plyr
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault() // Prevent default browser behavior (scrolling)
            player.currentTime = Math.max(player.currentTime - 5, 0) // Seek backward 5 seconds
            break
          case 'ArrowRight':
            event.preventDefault() // Prevent default browser behavior
            player.currentTime = Math.min(player.currentTime + 5, player.duration) // Seek forward 5 seconds
            break
          default:
            break
        }
      }
    }

    // Attach event listener to the entire window
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [videoSrc])

  return (
    <div className="flex h-full w-full justify-center">
      <Plyr
        id="plyr"
        options={{
          controls: [
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'settings',
            'fullscreen',
            'pip'
          ],
          autoplay: false,
          seekTime: 5,
          ratio: '16:9'
        }}
        source={{}} // Pass an empty source since HLS will load it
        ref={ref}
      />
    </div>
  )
}

export default function AnimePahePlayerEmbedded({ videoSrc }) {
  const supported = Hls.isSupported()

  return (
    <div className="flex h-full w-full items-center justify-center">
      {supported ? <MyComponent videoSrc={videoSrc} /> : 'HLS is not supported in your browser'}
    </div>
  )
}
