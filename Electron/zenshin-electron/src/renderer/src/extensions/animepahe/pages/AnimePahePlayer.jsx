import { useEffect, useRef } from 'react'
import Hls from 'hls.js'
import Plyr from 'plyr-react'
import { useParams } from 'react-router-dom'
import 'plyr-react/plyr.css'

const MyComponent = () => {
  const ref = useRef(null)
  const { videoSrc } = useParams()

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
  }, [])

  return (
    <div className="aspect-video w-4/6">
      <Plyr
        id="plyr"
        options={{ volume: 0.1 }}
        source={{}} // Pass an empty source since HLS will load it
        ref={ref}
      />
    </div>
  )
}

export default function AnimePahePlayer() {
  const supported = Hls.isSupported()

  return (
    <div className="mt-10 flex h-full w-full items-center justify-center">
      {supported ? <MyComponent /> : 'HLS is not supported in your browser'}
    </div>
  )
}
