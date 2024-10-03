// const WebTorrent = require('webtorrent')
// const electron = require('electron')
// const fs = require('fs')
// const path = require('path')

// // Send & receive messages from the main window
// const ipc = electron.ipcRenderer

// let client = new WebTorrent()
// // const downloadsDir = path.join(__dirname, 'downloads')

// // WebTorrent-to-HTTP streaming sever
// let server = null

// // init() is called when the window is loaded
// function init() {
//   listenToClientEvents()

//   ipc.on('wt-add-torrent', (e, magnet) => {
//     let files = addTorrent(magnet)
//     ipc.send('wt-torrent-files', files) // Send files back to the main window
//   })
// }

// // Listen to messages from the main window
// function listenToClientEvents() {
//   client.on('warning', (err) => ipc.send('wt-warning', null, err.message))
//   client.on('error', (err) => ipc.send('wt-error', null, err.message))
// }

// function addTorrent(magnet) {
//   let existingTorrent = client.get(magnet)

//   if (existingTorrent) {
//     // If torrent is already added, return its file information
//     let files = existingTorrent.files.map((file) => ({
//       name: file.name,
//       length: file.length
//     }))
//     console.log('Existing torrent files:', files)

//     return files
//   }

//   // Add torrent to client

//   /* ADD DOWNLOAD PATH HERE */
//   const torrent = client.add(magnet, { deselect: true })

//   torrent.on('metadata', () => {
//     const files = torrent.files.map((file) => ({
//       name: file.name,
//       length: file.length
//     }))

//     console.log('New torrent files:', files)
//     return files
//   })
// }
