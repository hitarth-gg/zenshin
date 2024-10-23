import React, { useEffect } from 'react'
import Plyr from 'plyr'
import 'plyr-react/plyr.css'

export const PlyrPlayer = (props) => {
  const videoRef = React.useRef(null)
  const playerRef = React.useRef(null)
  const { options, onReady } = props

  useEffect(() => {
    if (!playerRef.current) {
      const player = (playerRef.current = new Plyr(videoRef.current, options))

      // Log when the player is ready
      player.on('ready', () => {
        console.log('Plyr player is ready')
        onReady && onReady(player)
      })
    } else {
      // Update source or other options when props change
      playerRef.current.source = options.sources
    }
  }, [options])

  // Clean up Plyr instance on component unmount
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player) {
        player.destroy()
        playerRef.current = null
      }
    }
  }, [])

  return (
    <div>
      <video ref={videoRef} className="plyr-react plyr" />
    </div>
  )
}

export default PlyrPlayer
