import { app, shell, BrowserWindow, ipcMain, dialog, session, globalShortcut } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.ico?asset'
import { Deeplink } from 'electron-deeplink'
import { exec } from 'child_process'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { animepaheRouter } from './animepahe/routes/search'
import encUrls from '../../common/utils'
import DiscordRPC from '../renderer/src/utils/discord'
import WebSocket from 'ws'
import announce from '../../common/announce'

console.log('IN MAIN !!!')

// import path from 'path'
// import { fileURLToPath } from 'url'
let chalk
import('chalk').then((module) => {
  chalk = module.default
  console.log(chalk.green('Chalk is loaded!'))
})
let client = null
async function loadWebTorrent() {
  const { default: WebTorrent } = await import('webtorrent')
  try {
    client = new WebTorrent()
    console.log('WebTorrent loaded:')
  } catch (error) {
    console.error('Error loading WebTorrent:', error)
  }
}
loadWebTorrent()

// import isDev from 'electron-is-dev'
// app.commandLine.appendSwitch('force_low_power_gpu')
// app.commandLine.appendSwitch('force_high_performance_gpu')

let mainWindow // Define mainWindow here
const zenshinPathDocuments = app.getPath('documents') + '/Zenshin'
let downloadsDir = path.join(app.getPath('downloads'), 'ZenshinDownloads')
let defaultDownloadsDir = path.join(app.getPath('downloads'), 'ZenshinDownloads')
const settingsPath = path.join(zenshinPathDocuments, 'settings.json')
let backendPort = 64621
let backendServer
const discordClientId = '1312155472781901824'
// let rpcClient = new DiscordRPC(discordClientId)
let rpcClient = null
let broadcastDiscordRpc = true
let extensionUrls = {}
// let zoomFactor = 1.0

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    minWidth: 900,
    minHeight: 670,
    backgroundColor: '#1c1c1c',
    show: false,
    // frame: false,
    // frame: process.platform === 'darwin', // Only keep the native frame on Mac
    titleBarStyle: 'hidden',
    icon: icon,
    titleBarOverlay: {
      color: '#17191c00',
      symbolColor: '#eee',
      height: 45
    },
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      devTools: true,
      webSecurity: false
    }
  })
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit() // Quit the app if another instance is already running
    return
  } else {
    app.on('second-instance', () => {
      // If the user tried to run a second instance, show the existing window
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore()
        }
        mainWindow.focus()
      }
    })
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // app.getGPUInfo('complete').then((info) => {
  //   console.log(info)
  // })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // don't throw an error if the file doesn't exist
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Handle IPC events
  ipcMain.on('minimize-window', () => mainWindow.minimize())
  ipcMain.on('open-folder', (event, folder) => {
    shell.openPath(folder)
  })
  ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.on('close-window', () => mainWindow.close())

  ipcMain.on('oauth-login', (event, authUrl) => {
    shell.openExternal(authUrl) // Open the OAuth URL in the default browser
  })

  ipcMain.on('open-vlc', (event, command) => {
    exec(command, (error) => {
      if (error) {
        dialog.showErrorBox(
          'Error launching External Player, make sure the path to .exe is correct. You can specify the correct path to it in the settings\n',
          error.message
        )
      }
    })
  })

  // start the backend server
  if (backendServer) {
    backendServer.close(() => {
      console.log('Backend server stopped.')
      startServer() // Restart the server on the new port
    })
  } else {
    startServer() // Start the server if it's not running yet
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  // Reset Zoom to default

  // globalShortcut.register('CommandOrControl+=', () => {
  //   zoomFactor += 0.1
  //   mainWindow.webContents.setZoomFactor(zoomFactor)
  // })

  // globalShortcut.register('CommandOrControl+-', () => {
  //   zoomFactor -= 0.1
  //   if (zoomFactor < 0.1) zoomFactor = 0.1
  //   mainWindow.webContents.setZoomFactor(zoomFactor)
  // })

  // globalShortcut.register('CommandOrControl+0', () => {
  //   zoomFactor = 1.0
  //   mainWindow.webContents.setZoomFactor(zoomFactor)
  // })

  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  const zenshinPathDocuments = app.getPath('documents') + '/Zenshin'
  if (!fs.existsSync(zenshinPathDocuments)) {
    fs.mkdirSync(zenshinPathDocuments)
  }

  // create settings.json file if it doesn't exist
  if (!fs.existsSync(settingsPath)) {
    try {
      let json_obj = {
        downloadsFolderPath: downloadsDir,
        backendPort: backendPort,
        broadcastDiscordRpc: true,
        extensionUrls: {}
      }
      fs.writeFileSync(settingsPath, JSON.stringify(json_obj, null, 2))
    } catch (error) {
      console.error('Error creating settings.json file:', error)
      dialog.showErrorBox('Error creating settings.json file:', error.message)
    }
  }
  // change variables according to settings.json
  let settings = JSON.parse(fs.readFileSync(settingsPath))
  backendPort = settings.backendPort || 64621
  downloadsDir = settings.downloadsFolderPath || defaultDownloadsDir
  broadcastDiscordRpc = settings.broadcastDiscordRpc && true
  extensionUrls = settings.extensionUrls

  ipcMain.on('open-animepahe', () => {
    const webview = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        session: session.defaultSession,
        preload: join(__dirname, '../preload/webview.js')
      }
    })
    webview.loadURL(encUrls.pahe)

    webview.webContents.on('did-finish-load', async () => {
      const cookies = await webview.webContents.session.cookies.get({})
      console.log('Cookies from webview:', cookies)
      // fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2))

      // save cookies in documents directory, write file asynchronusly
      fs.writeFile(
        path.join(zenshinPathDocuments, 'cookies.json'),
        JSON.stringify(cookies, null, 2),
        (err) => {
          if (err) {
            console.error('Error writing cookies:', err)
            return
          }
          console.log('Cookies saved successfully')
        }
      )
    })
  })

  ipcMain.on('change-downloads-folder', () => {
    dialog

      .showOpenDialog({
        title: 'Select Downloads Folder',
        defaultPath: downloadsDir,
        properties: ['openDirectory']
      })
      .then((result) => {
        if (!result.canceled) {
          downloadsDir = result.filePaths[0]
          console.log('Downloads directory changed to:', downloadsDir)

          // Save the new downloads directory in settings.json
          const settingsPath = path.join(zenshinPathDocuments, 'settings.json')
          fs.writeFileSync(
            settingsPath,
            JSON.stringify(
              {
                ...JSON.parse(fs.readFileSync(settingsPath)),
                downloadsFolderPath: downloadsDir
              },
              null,
              2
            )
          )
          // Send the new downloads directory to the renderer process
          mainWindow.webContents.send(
            'receive-settings-json',
            JSON.parse(fs.readFileSync(settingsPath))
          )
        }
      })
      .catch((err) => {
        console.error('Error selecting downloads folder:', err)
      })
  })

  // change port of backend server
  ipcMain.on('change-backend-port', (event, port) => {
    backendPort = port
    console.log('Backend port changed to:', backendPort)

    // Save the new backend port in settings.json
    fs.writeFileSync(
      settingsPath,
      JSON.stringify(
        {
          ...JSON.parse(fs.readFileSync(settingsPath)),
          backendPort: backendPort
        },
        null,
        2
      )
    )
    // Send the new backend port to the renderer process
    mainWindow.webContents.send('receive-settings-json', JSON.parse(fs.readFileSync(settingsPath)))

    // Restart the backend server
    if (backendServer) {
      backendServer.close(() => {
        console.log('Backend server stopped.')
        startServer() // Restart the server on the new port
      })
    } else {
      startServer() // Start the server if it's not running yet
    }
  })

  // change discord rpc setting
  ipcMain.on('broadcast-discord-rpc', (event, value) => {
    broadcastDiscordRpc = value

    fs.writeFileSync(
      settingsPath,
      JSON.stringify(
        {
          ...JSON.parse(fs.readFileSync(settingsPath)),
          broadcastDiscordRpc: broadcastDiscordRpc
        },
        null,
        2
      )
    )
    if (value === false && rpcClient) {
      try {
        rpcClient.disconnect()
        rpcClient = null
      } catch (error) {
        console.error('Error stopping Discord RPC:')
      }
    } else if (value === true) startBroadcastingDiscordRpc()
    console.log('Discord RPC setting changed to:', broadcastDiscordRpc)
  })

  ipcMain.on('get-settings-json', () => {
    mainWindow.webContents.send('receive-settings-json', JSON.parse(fs.readFileSync(settingsPath)))
  })

  ipcMain.on('reload-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.webContents.reload()
    }
  })

  createWindow()

  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('zenshin2', process.execPath, [path.resolve(process.argv[1])])
  } else {
    app.setAsDefaultProtocolClient('zenshin2')
  }

  function startBroadcastingDiscordRpc() {
    console.log('Starting Discord RPC...')

    try {
      rpcClient = new DiscordRPC(discordClientId)
      rpcClient.initialize()

      // set default activity
      setTimeout(() => {
        rpcClient.setActivity({
          details: 'Browsing Anime',
          state: 'Looking for anime to watch',
          // largeImageKey: 'logo',
          // largeImageText: 'Anime Time!',
          // smallImageKey: 'logo',
          // smallImageText: 'Streaming',
          startTimestamp: Date.now()
        })
      }, 3000)
    } catch (error) {
      console.error('Error starting Discord RPC:')
    }
  }

  // Discord RPC
  if (broadcastDiscordRpc) {
    startBroadcastingDiscordRpc()
  }

  // set discord rpc activity
  ipcMain.on('set-discord-rpc', (event, activityDetails) => {
    if (!rpcClient || broadcastDiscordRpc === false) return
    rpcClient.setActivity(activityDetails)
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // remove rpc client
    if (rpcClient) rpcClient.disconnect()

    if (backendServer) {
      backendServer.close(() => {
        console.log('Backend server stopped.')
      })
    }

    app.quit()
  }
})

const protocol = 'zenshin'
const isDev = true
const deeplink = new Deeplink({ app, mainWindow, protocol, isDev })

deeplink.on('received', (link) => {
  console.log('Received deeplink:', link)
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('deeplink-received', link)
  }
})

// const { downloadsFolderPath } = JSON.parse(fs.readFileSync(settingsPath))

const app2 = express()
// const client = new WebTorrent()

app2.use(cors())

function mkdirp(dir) {
  if (fs.existsSync(dir)) {
    return true
  }
  const dirname = path.dirname(dir)
  mkdirp(dirname)
  fs.mkdirSync(dir)
}

if (downloadsDir === defaultDownloadsDir) mkdirp(defaultDownloadsDir)

/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */

function startServer() {
  backendServer = app2.listen(backendPort, () => {
    console.log(`Server running at http://localhost:${backendPort}`)
  })

  backendServer.on('upgrade', (request, socket, head) => {
    console.log('UPGRADE event triggered')

    if (request.url === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request)
      })
    } else {
      console.log('Invalid WebSocket upgrade request')
      socket.destroy()
    }
  })
}

/* ----------------- SEED EXISTING FILES ---------------- */
// Seed all existing files on server startup
// let torrentDownloadPath = downloadsFolderPath || defaultDownloadsDir
// const seedExistingFiles = () => {
//   fs.readdir(downloadsDir, (err, files) => {
//     if (err) {
//       console.error('Error reading downloads directory:', err)
//       return
//     }

//     files.forEach((file) => {
//       const filePath = path.join(downloadsDir, file)

//       if (fs.lstatSync(filePath).isFile()) {
//         client.seed(filePath, { path: downloadsDir }, (torrent) => {
//           // console.log(`Seeding file: ${filePath}`);
//           // console.log(`Magnet URI: ${torrent.magnetURI}`);
//           console.log(chalk.bgBlue('Seeding started: '), chalk.cyan(torrent.name))
//           torrent.on('error', (err) => {
//             console.error(chalk.bgRed('Error seeding file:'), err)
//           })
//         })
//       }
//     })
//   })
// }

// // Call the function to start seeding existing files
// seedExistingFiles()
/* ------------------------------------------------------ */

app2.get('/add/:magnet', async (req, res) => {
  let magnet = req.params.magnet

  /* ------------------------------------------------------ */
  // Check if the torrent is already added
  let existingTorrent = await client.get(magnet)
  console.log('Existing torrent:', existingTorrent)

  if (existingTorrent) {
    // If torrent is already added, return its file information
    let files = existingTorrent.files.map((file) => ({
      name: file.name,
      length: file.length
    }))
    // console.log("Existing torrent files:", files);

    return res.status(200).json(files)
  }
  /* ------------------------------------------------------ */

  client.add(magnet, function (torrent) {
    let files = torrent.files.map((file) => ({
      name: file.name,
      length: file.length
    }))
    // console.log(files);

    res.status(200).json(files)
  })
})

/* -------------------- GET METADATA -------------------- */
app2.get('/metadata/:magnet', async (req, res) => {
  let magnet = req.params.magnet

  /* ------------------------------------------------------ */
  // Check if the torrent is already added
  let existingTorrent = await client.get(magnet)
  console.log('Existing torrent:', existingTorrent)

  if (existingTorrent) {
    // If torrent is already added, return its file information
    let files = existingTorrent.files.map((file) => ({
      name: file.name,
      length: file.length
    }))
    // console.log('Announce:', existingTorrent.announce);
    // console.log("Existing torrent files:", files);

    return res.status(200).json(files)
  }
  /* ------------------------------------------------------ */

  // stop all other torrents
  client.torrents.forEach((torrent) => {
    console.log(chalk.bgRed('Download Stopped:') + ' ' + chalk.cyan(torrent.name))
    torrent.destroy()
  })

  const torrent = client.add(magnet, { path: downloadsDir, deselect: true /* , announce */ })

  torrent.on('metadata', () => {
    const files = torrent.files.map((file) => ({
      name: file.name,
      length: file.length
    }))
    console.log(files)

    // deselect all files
    torrent.files.forEach((file) => {
      file.deselect()
    })

    res.status(200).json(files)
  })
})

/* ------------------------------------------------------ */
/*                        NEW META                        */
/* ------------------------------------------------------ */
const wss = new WebSocket.Server({ noServer: true })
// const wss = new WebSocket.Server({ port: 64622 })

wss.on('connection', (ws) => {
  console.log('Client connected')
  const interval = setInterval(() => {
    let data = []
    // data.push()
    data.push({ clientDownloadSpeed: client.downloadSpeed, clientUploadSpeed: client.uploadSpeed })
    const file = client.torrents.map((torrent) => ({
      name: torrent.name,
      length: torrent.length,
      downloadSpeed: torrent.downloadSpeed,
      uploadSpeed: torrent.uploadSpeed,
      downloaded: torrent.downloaded,
      uploaded: torrent.uploaded,
      progress: torrent.progress,
      done: torrent.done,
      magnet: torrent.magnetURI
    }))

    data = [...data, ...file]

    ws.send(JSON.stringify(data))
  }, 1000)
  // Clear interval when the client disconnects
  ws.on('close', () => {
    console.log('Client disconnected')
    clearInterval(interval)
  })
})

app2.get('/downloadsInfo', async (req, res) => {
  let files = []

  client.torrents.forEach((torrent) => {
    let torrentFiles = {
      name: torrent.name,
      length: torrent.length,
      downloadSpeed: torrent.downloadSpeed,
      uploadSpeed: torrent.uploadSpeed,
      downloaded: torrent.downloaded,
      uploaded: torrent.uploaded,
      progress: torrent.progress,
      done: torrent.done,
      magnet: torrent.magnetURI
    }

    // files = files.concat(torrentFiles)
    files.push(torrentFiles)
  })

  res.status(200).json(files)
})

/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
app2.get('/streamfile/:magnet/:filename', async function (req, res, next) {
  let magnet = req.params.magnet
  let filename = req.params.filename

  console.log(magnet)

  let tor = await client.get(magnet)

  if (!tor) {
    return res.status(404).send('Torrent not found')
  }

  let file = tor.files.find((f) => f.name === filename)
  console.log('file :' + file.toString())

  if (!file) {
    return res.status(404).send('No file found in the torrent')
  }
  console.log(file)

  file.select()

  let range = req.headers.range

  console.log('Range : ' + range)

  if (!range) {
    return res.status(416).send('Range is required')
  }

  let positions = range.replace(/bytes=/, '').split('-')
  let start = parseInt(positions[0], 10)
  let file_size = file.length
  let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1
  let chunksize = end - start + 1

  let head = {
    'Content-Range': `bytes ${start}-${end}/${file_size}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': 'video/x-matroska'
  }

  res.writeHead(206, head)

  let stream_position = {
    start: start,
    end: end
  }

  detailsOfEpisode.percentageWatched = (start / end) * 100
  console.log(detailsOfEpisode)

  let stream = file.createReadStream(stream_position)
  stream.pipe(res)

  stream.on('error', function (err) {
    console.error('Stream error:', err)
    // Only send a response if headers haven't been sent yet
    if (!res.headersSent) {
      return res.status(500).send('Error streaming the video')
    }
  })

  stream.on('close', () => {
    console.log('Stream closed prematurely')
  })
})

// Deselect an episode with the given filename
app2.get('/deselect/:magnet/:filename', async (req, res) => {
  let magnet = req.params.magnet
  let filename = req.params.filename

  let tor = await client.get(magnet)

  if (!tor) {
    return res.status(404).send('Torrent not found')
  }

  let file = tor.files.find((f) => f.name === filename)

  // deselect all files

  if (!file) {
    return res.status(404).send('No file found in the torrent')
  }

  console.log(chalk.bgRed('Download Stopped:') + ' ' + chalk.cyan(file.name))

  file.deselect()
  file.deselect()
  file.deselect()

  res.status(200).send('File deselected successfully')
})

// get download details of a file

let detailsOfEpisode = {
  name: '',
  length: 0,
  downloaded: 0,
  progress: 0,
  percentageWatched: 0
}

app2.get('/detailsepisode/:magnet/:filename', async (req, res) => {
  let magnet = req.params.magnet
  let filename = req.params.filename

  let tor = await client.get(magnet)
  if (!tor) {
    return res.status(404).send('Torrent not found')
  }

  let file = tor.files.find((f) => f.name === filename)
  if (!file) {
    return res.status(404).send('No file found in the torrent')
  }

  // let details = {
  detailsOfEpisode = {
    name: file.name,
    length: file.length,
    downloaded: file.downloaded,
    progress: file.progress,
    percentageWatched: detailsOfEpisode.percentageWatched
  }

  res.status(200).json(detailsOfEpisode)
})

/* ------------------------------------------------------ */

app2.get('/stream/:magnet', async function (req, res, next) {
  let magnet = req.params.magnet
  console.log(magnet)

  let tor = await client.get(magnet)

  if (!tor) {
    return res.status(404).send('Torrent not found')
  }

  let file = tor.files.find((f) => f.name.endsWith('.mkv'))
  console.log('file :' + file.toString())

  if (!file) {
    return res.status(404).send('No MP4 file found in the torrent')
  }

  let range = req.headers.range
  console.log('Range : ' + range)

  if (!range) {
    return res.status(416).send('Range is required')
  }

  let positions = range.replace(/bytes=/, '').split('-')
  let start = parseInt(positions[0], 10)
  let file_size = file.length
  let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1
  let chunksize = end - start + 1

  let head = {
    'Content-Range': `bytes ${start}-${end}/${file_size}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': 'video/x-matroska'
  }

  res.writeHead(206, head)

  let stream_position = {
    start: start,
    end: end
  }

  let stream = file.createReadStream(stream_position)
  stream.pipe(res)

  stream.on('error', function (err) {
    console.error('Stream error:', err)
    // Only send a response if headers haven't been sent yet
    if (!res.headersSent) {
      return res.status(500).send('Error streaming the video')
    }
  })

  stream.on('close', () => {
    console.log('Stream closed prematurely')
  })
})

app2.get('/details/:magnet', async (req, res) => {
  let magnet = req.params.magnet

  // Find the torrent by magnet link
  let tor = await client.get(magnet)
  if (!tor) {
    return res.status(404).send('Torrent not found')
  }

  // Prepare torrent details
  let details = {
    name: tor.name,
    length: tor.length,
    downloaded: tor.downloaded,
    uploaded: tor.uploaded,
    downloadSpeed: tor.downloadSpeed,
    uploadSpeed: tor.uploadSpeed,
    progress: tor.progress,
    ratio: tor.ratio,
    numPeers: tor.numPeers
  }

  res.status(200).json(details)
})

/* --------------- Handling VLC streaming --------------- */
// import { get } from 'http'
// import { fileURLToPath } from 'url'
// Full path to VLC executable, change it as needed
const vlcPath = '"C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe"' // Adjust this path as needed

app2.get('/stream-to-vlc', async (req, res) => {
  const { url, magnet } = req.query

  if (!url) {
    return res.status(400).send('URL is required')
  }
  const vlcCommand = `${vlcPath} "${url}"`

  exec(vlcCommand, (error) => {
    if (error) {
      console.error(`Error launching VLC: ${error.message}`)
      return res.status(500).send('Error launching VLC')
    }
    res.send('VLC launched successfully')
  })
})
/* ------------------------------------------------------ */

app2.delete('/remove/:magnet', async (req, res) => {
  let magnet = req.params.magnet

  // Find the torrent by magnet link
  let tor = await client.get(magnet)
  if (!tor) {
    return res.status(404).send('Torrent not found')
  }

  // Destroy the torrent to stop downloading and remove it from the client
  tor.destroy((err) => {
    if (err) {
      console.error('Error removing torrent:', err)
      return res.status(500).send('Error removing torrent')
    }

    res.status(200).send('Torrent removed successfully')
  })
})

// ping backend
app2.get('/ping', (req, res) => {
  res.status(200).send('pong')
})

// do not start the server again if it is already running

// app2.listen(64621, () => {
//   console.log('Server running at http://localhost:64621')
// })

/* ------------------------------------------------------ */
/* ---------------------- ANIMEPAHE --------------------- */
/* ------------------------------------------------------ */

app2.use('/animepahe', animepaheRouter)

module.exports.extensionUrls = extensionUrls
