import { app, shell, BrowserWindow, ipcMain, dialog, session } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Deeplink } from 'electron-deeplink'
import { exec } from 'child_process'
import express from 'express'
import WebTorrent from 'webtorrent'
import cors from 'cors'
import fs from 'fs'
// import path from 'path'
// import { fileURLToPath } from 'url'
let chalk
import('chalk').then((module) => {
  chalk = module.default
  console.log(chalk.green('Chalk is loaded!'))
})

// import isDev from 'electron-is-dev'

let mainWindow // Define mainWindow here

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

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

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
          'Error launching VLC, make sure the path to VLC.exe is correct. You can specify the correct path to it in the settings\n',
          error.message
        )
      }
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
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

  app2.listen(64621, () => {
    console.log('Server running at http://localhost:64621')
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

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Get the current directory
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const downloadsDir = path.join(__dirname, 'downloads')
// const downloadsDir = path.join(app.getPath('downloads'), 'Zenshin')

// const appPath = app.getAppPath()
// console.log('App is running from:', appPath)
// const downloadsDir = path.join(appPath, 'ZenshinDownloads')

let downloadsDir = path.join(app.getPath('downloads'), 'ZenshinDownloads')

const app2 = express()
const client = new WebTorrent()

app2.use(cors())

function mkdirp(dir) {
  if (fs.existsSync(dir)) {
    return true
  }
  const dirname = path.dirname(dir)
  mkdirp(dirname)
  fs.mkdirSync(dir)
}

mkdirp(downloadsDir)

/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */

const owner = 'hitarth-gg' // Replace with the repository owner
const repo = 'zenshin' // Replace with the repository name
const currentVersion = 'v1.0.0' // Replace with the current version

// const getLatestRelease = async () => {
//   try {
//     const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     const data = await response.json()

//     if (data.tag_name !== currentVersion) {
//       console.log(chalk.blue('New version available:', data.tag_name))
//       console.log('Release notes:', data.body)
//       console.log(chalk.yellow('Download URL: https://github.com/hitarth-gg/zenshin/releases'))
//     }
//   } catch (error) {
//     console.error('Error fetching latest release:', error)
//   }
// }
// getLatestRelease()
/* ------------------------------------------------------ */

/* ----------------- SEED EXISTING FILES ---------------- */
// Seed all existing files on server startup
const seedExistingFiles = () => {
  fs.readdir(downloadsDir, (err, files) => {
    if (err) {
      console.error('Error reading downloads directory:', err)
      return
    }

    files.forEach((file) => {
      const filePath = path.join(downloadsDir, file)

      if (fs.lstatSync(filePath).isFile()) {
        client.seed(filePath, { path: downloadsDir }, (torrent) => {
          // console.log(`Seeding file: ${filePath}`);
          // console.log(`Magnet URI: ${torrent.magnetURI}`);
          console.log(chalk.bgBlue('Seeding started: '), chalk.cyan(torrent.name))
          torrent.on('error', (err) => {
            console.error(chalk.bgRed('Error seeding file:'), err)
          })
        })
      }
    })
  })
}

// Call the function to start seeding existing files
seedExistingFiles()
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
    // console.log("Existing torrent files:", files);

    return res.status(200).json(files)
  }
  /* ------------------------------------------------------ */

  const torrent = client.add(magnet, { path: downloadsDir, deselect: true })

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
import { get } from 'http'
import { fileURLToPath } from 'url'
import { animepaheRouter } from './animepahe/routes/search'
import encUrls from '../../common/utils'
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
