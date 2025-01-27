import { useEffect, useState } from 'react'
import formatBytes from '../utils/formatBytes'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import nFormatter from '../utils/nFormatter'
import { useNavigate } from 'react-router-dom'

function Downloads() {
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
  // remove first element from array and store rest in rem
  let rem = message.slice(1)
  console.log(rem)

  return (
    <div className="mx-9 mt-8 font-space-mono tracking-wide">
      <div className="mb-2 border-b border-gray-700 pb-1 font-space-mono text-lg font-bold tracking-wider">
        Downloads
      </div>

      {rem.map((e, index) => (
        <div
          key={index}
          className="flex animate-fade-up my-3 flex-col rounded-sm bg-[#212426] px-4 py-2"
        >
          <p className="text-sm">{e.name}</p>
          <div className="my-2 ml-1 flex gap-x-4">
            <p className="flex w-40 items-center justify-end gap-x-2 text-sm">
              {formatBytes(e.downloadSpeed)}/s
              <ArrowDownIcon />
            </p>
            <p className="flex w-40 items-center justify-end gap-x-2 text-sm">
              {formatBytes(e.uploadSpeed)}/s
              <ArrowUpIcon />
            </p>
            <p className="flex w-48 items-center justify-end gap-x-2 text-sm">
              {(e.progress * 100).toFixed(2)}% Completed
            </p>
            <p className="flex w-48 items-center justify-end gap-x-2 text-sm">
              {formatBytes(e.downloaded)} Downloaded
            </p>
            <p className="flex w-48 items-center justify-end gap-x-2 text-sm">
              {formatBytes(e.uploaded)} Uploaded
            </p>
          </div>
          <div className="downloadProgressBar h-1 w-full bg-gray-600">
            {/* <div className="progress border" style={{ width: `${e.progress * 100}%` }}> */}
            <div className="progress h-1 bg-blue-500" style={{ width: `${e.progress * 100}%` }}>
              {/* <div className="progressText">{e.progress * 100}%</div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Downloads
