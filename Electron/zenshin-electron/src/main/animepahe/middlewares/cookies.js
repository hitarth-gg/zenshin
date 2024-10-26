import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import encUrls from '../../../../common/utils'

const baseUrl = encUrls.pahe

// Middleware to read cookies from cookies.json and attach the base URL and cookies to the request object
async function cookieMiddleware(req, res, next) {
  try {
    // Get the path to the downloads folder
    const zenshinPathDocuments = app.getPath('documents') + '/Zenshin'

    // Read the cookies.json file asynchronously
    const data = await fs.promises.readFile(path.join(zenshinPathDocuments, 'cookies.json'), 'utf8')

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
