import { app } from 'electron'
import express from 'express'
import fs from 'fs'
import path from 'path'

// Define the base URL here or use an environment variable
const baseUrl = 'https://animepahe.ru' // or use process.env.BASE_URL

// Middleware to read cookies from cookies.json and attach the base URL and cookies to the request object
async function cookieMiddleware(req, res, next) {
  try {
    // Get the path to the downloads folder
    const downloadsDir = path.join(app.getPath('downloads'), 'ZenshinDownloads')

    // Read the cookies.json file asynchronously
    const data = await fs.promises.readFile(path.join(downloadsDir, 'cookies.json'), 'utf8')

    // Parse the cookies and generate the cookie string
    const cookieString = JSON.parse(data)
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ')

    // Attach the cookieString and baseUrl to the request object
    req.cookiesString = cookieString
    req.baseUrl = baseUrl

    next()
  } catch (error) {
    console.error('Failed to read cookies or base URL:', error)
    res.status(500).send({ error: 'Could not read cookies or base URL.' })
  }
}

export default cookieMiddleware
