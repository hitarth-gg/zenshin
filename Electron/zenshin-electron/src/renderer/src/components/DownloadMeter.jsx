import { ArrowDownIcon, ArrowUpIcon, BarChartIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import formatBytes from '../utils/formatBytes'
import { Button, Tooltip } from '@radix-ui/themes'

function DownloadMeter() {
  const [message, setMessage] = useState([])
  const [statusWs, setStatus] = useState('Disconnected')

  useEffect(() => {
    // Create a new WebSocket connection
    // const socket = new WebSocket('ws://localhost:64622')
    const socket = new WebSocket('ws://localhost:64621/ws')

    // Handle WebSocket events
    socket.onopen = () => {
      console.log('WebSocket connected')
      setStatus('Connected')
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // console.log('Received data:', data)
      setMessage(data)
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
      setStatus('Disconnected')
    }

    // Cleanup the WebSocket on unmount
    return () => {
      socket.close()
    }
  }, [])

  let clientDownloadSpeed = message[0]?.clientDownloadSpeed || 0
  let clientUploadSpeed = message[0]?.clientUploadSpeed || 0
  const [showFullSpeed, setShowFullSpeed] = useState(false)
  const [alwaysShow, setAlwaysShow] = useState(false)
  return (
    <div className="relative">
      <Tooltip content="Toggle Torrent Speeds" side="right">
        <Button
          size={'1'}
          color="gray"
          variant="soft"
          onMouseOver={() => setShowFullSpeed(true)}
          onMouseLeave={() => setShowFullSpeed(false)}
          onClick={() => setAlwaysShow(!alwaysShow)}
        >
          <BarChartIcon />
        </Button>
      </Tooltip>
      {(showFullSpeed || alwaysShow) && (
        <div className="absolute -left-20 top-10 z-50 rounded-sm bg-[#111113]">
          <div className="flex w-52 select-none justify-center gap-x-2 text-nowrap px-1 py-2 font-space-mono text-xs">
            <div className="flex items-center gap-x-1">
              {formatBytes(clientDownloadSpeed)}/{/* asddasddas */}
              <ArrowDownIcon />
            </div>

            <div className="flex items-center gap-x-1">
              {formatBytes(clientUploadSpeed)}/s
              <ArrowUpIcon />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DownloadMeter
