import express from 'express'
import cookieMiddleware from '../middlewares/cookies.js'
import encUrls from '../../../../common/utils.js'
import rageParse from '../../../../common/unpacker.js'
const router = express.Router() // Use a router to define routes

// Define the /search route with the cookieMiddleware
router.get('/search', cookieMiddleware, async (req, res) => {
  // console.log(`Search query: ${req.query.q}`)
  const { cookiesString, baseUrl } = req // Access baseUrl and cookiesString

  try {
    const response = await fetch(`${baseUrl}/api?m=search&q=${req.query.q}`, {
      headers: {
        Cookie: cookiesString
      }
    })

    if (!response.ok) {
      if (response.status === 403) {
        return res.status(403).send({
          status: 403,
          error: 'Please use webview to enter the website then close the webview window.'
        })
      }
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error(`Failed to fetch webpage: ${error.message}`)
    res.status(500).send({
      status: 500,
      error: error.message
    })
  }
})

// Use the same middleware for /latest route
router.get('/latest', cookieMiddleware, async (req, res) => {
  const { cookiesString, baseUrl } = req
  const page = req.query.page || 1

  try {
    const response = await fetch(`${baseUrl}/api?m=airing&page=${page}`, {
      headers: {
        Cookie: cookiesString
      }
    })

    if (!response.ok) {
      if (response.status === 403) {
        return res.status(403).send({
          status: 403,
          error: 'Please use webview to enter the website then close the webview window.'
        })
      }
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error(`Failed to fetch webpage: ${error.message}`)
    res.status(500).send({
      status: 500,
      error: error.message
    })
  }
})

// Route: /details
router.get('/details', cookieMiddleware, async (req, res) => {
  try {
    const { id } = req.query
    console.log(`Detail query: ${id}`)

    const { cookiesString, baseUrl } = req

    const response = await fetch(`${baseUrl}/anime/${id}`, {
      headers: {
        Cookie: cookiesString
      }
    })

    if (!response.ok) {
      if (response.status === 403) {
        return res.status(403).send({
          status: 403,
          error: 'Please use webview to enter the website then close the webview window.'
        })
      }
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.text()
    const title = data.match(/<span>(.+?)<\/span>/)[1]
    const cover = data.match(/<a href="(https:\/\/i.animepahe.ru\/posters.+?)"/)[1]
    const desc = data.match(/<div class="anime-synopsis">(.+?)<\/div>/)[1]
    const anilist_id = data.match(/<a href="\/\/anilist.co\/anime\/(.+?)"/)

    res.status(200).send({
      title: title,
      anilist_id: anilist_id ? anilist_id[1] : null,
      cover: cover,
      desc: desc
    })
  } catch (error) {
    console.error(`Failed to fetch webpage: ${error.message}`)
    res.status(500).send({
      status: 500,
      error: error.message
    })
  }
})

// Route: /episodes
router.get('/episodes', cookieMiddleware, async (req, res) => {
  const { id } = req.query
  const page = req.query.page || 1

  try {
    const { cookiesString, baseUrl } = req

    const response = await fetch(`${baseUrl}/api?m=release&id=${id}&page=${page}`, {
      headers: {
        Cookie: cookiesString
      }
    })

    if (!response.ok) {
      if (response.status === 403) {
        return res.status(403).send({
          status: 403,
          error: 'Please use webview to enter the website then close the webview window.'
        })
      }
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error(`Failed to fetch webpage: ${error.message}`)
    res.status(500).send({
      status: 500,
      error: error.message
    })
  }
})

// Route: /getallepisodes
router.get('/getallepisodes', cookieMiddleware, async (req, res) => {
  const { id } = req.query
  let currentPage = req.query.page || 1
  let lastPage = 1
  let allEpisodes = []

  try {
    const { cookiesString, baseUrl } = req

    do {
      const response = await fetch(`${baseUrl}/api?m=release&id=${id}&page=${currentPage}`, {
        headers: {
          Cookie: cookiesString
        }
      })

      if (!response.ok) {
        if (response.status === 403) {
          return res.status(403).send({
            status: 403,
            error: 'Please use webview to enter the website then close the webview window.'
          })
        }
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      allEpisodes = allEpisodes.concat(data.data)
      currentPage = data.current_page + 1
      lastPage = data.last_page
    } while (currentPage <= lastPage)

    res.json({
      total: allEpisodes.length,
      episodes: allEpisodes
    })
  } catch (error) {
    console.error(`Failed to fetch webpage: ${error.message}`)
    res.status(500).send({
      status: 500,
      error: error.message
    })
  }
})

// Route: /play
router.get('/play', cookieMiddleware, async (req, res) => {
  const { cookiesString, baseUrl } = req

  console.log(`Play query: ${req.query.id}`)
  console.log(`Episode: ${req.query.episode}`)
  console.log('URL: ', `${baseUrl}/play/${req.query.id}/${req.query.episode}`)

  try {
    const response = await fetch(`${baseUrl}/play/${req.query.id}/${req.query.episode}`, {
      headers: {
        Cookie: cookiesString
      }
    })

    if (!response.ok) {
      if (response.status === 403) {
        return res.status(403).send({
          status: 403,
          error: 'Please use webview to enter the website then close the webview window.'
        })
      }

      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const resp = await response.text()

    // Parse the HTML to extract buttons with data-fansub and data-audio defined
    const buttonsData = []
    const buttonRegex =
      /<button[^>]+data-src="(https:\/\/kwik\.si.+?)"[^>]+data-fansub="(.+?)"[^>]+data-resolution="(.+?)"[^>]+data-audio="(.+?)"[^>]*>/g
    let match

    while ((match = buttonRegex.exec(resp)) !== null) {
      const src = match[1]
      const fansub = match[2]
      const resolution = match[3]
      const audio = match[4]

      buttonsData.push({ src, fansub, resolution, audio })
    }

    if (buttonsData.length === 0) {
      throw new Error('No valid data-fansub buttons found in the page.')
    }

    console.log('Extracted buttons data:', buttonsData)

    // Fetch each src and extract hidden URLs
    const urls = []
    for (const button of buttonsData) {
      try {
        const hid_res = await fetch(button.src, {
          headers: {
            Referer: encUrls.pahe,
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56'
          }
        })

        if (!hid_res.ok) {
          console.error(`Failed to fetch hidden source: ${button.src}, Status: ${hid_res.status}`)
          continue // Skip this button and continue to the next one
        }

        const hid_data = await hid_res.text()

        // Extract all the obfuscated scripts that contain hidden URLs
        const scripts = hid_data.match(/eval\(f.+?\}\)\)/g)
        if (scripts) {
          for (const script of scripts) {
            const evalMatch = script.match(/eval(.+)/)
            // console.log('Eval match:', evalMatch[1])

            if (evalMatch && evalMatch[1]) {
              try {
                // const decode_script = eval(evalMatch[1]) // Safely evaluate the script

                // console.log('Eval matcg:', evalMatch[1])
                let decode_script = rageParse(evalMatch[1].toString())
                decode_script = decode_script.replace(/\\/g, '') // removes the character '\'
                // console.log('Decoded script:', decode_script)

                const urlMatch = decode_script.match(/source='(.+?)'/)
                // console.log('URL match:', urlMatch);

                if (urlMatch && urlMatch[1]) {
                  urls.push({
                    videoSrc: urlMatch[1],
                    fansub: button.fansub,
                    resolution: button.resolution,
                    audio: button.audio
                  })
                } else {
                  console.warn('No URL found in decoded script:', decode_script)
                }
              } catch (evalError) {
                console.error('Error evaluating script:', evalError)
              }
            } else {
              console.warn('No valid eval match found in script:', script)
            }
          }
        } else {
          console.warn('No scripts found in hid_data for button:', button.src)
        }
      } catch (fetchError) {
        console.error(`Error fetching source from button ${button.src}:`, fetchError)
      }
    }

    if (urls.length === 0) {
      throw new Error('No decoded URLs found.')
    }

    console.log('Decoded URLs: ', urls)

    // Return the decoded URLs as an array
    res.status(200).send(urls)
  } catch (error) {
    console.error(`Failed to fetch webpage: ${error.message}`)
    res.status(500).send({
      status: 500,
      error: error.message
    })
  }
})

// https://i.animepahe.ru/snapshots/069b876a55ac41fbbe3fc992f04297d7902b204a257762ed15a4c2901c21b28f.jpg
router.get('/image/snapshot/:id', cookieMiddleware, async (req, res) => {
  const { id } = req.params // Extract the ID from the URL parameter

  try {
    const { cookiesString } = req

    // Fetch the image from the external source
    const response = await fetch(`${encUrls.paheimages}/snapshots/${id}`, {
      headers: {
        Cookie: cookiesString
      }
    })

    // Check if the response is ok
    if (!response.ok) {
      if (response.status === 403) {
        return res.status(403).send({
          status: 403,
          error: 'Please use webview to enter the website then close the webview window.'
        })
      }
      // Return error status and message without parsing
      return res.status(response.status).send({
        status: response.status,
        error: `HTTP error! Status: ${response.status}`
      })
    }

    // Get the image content type from the response
    const contentType = response.headers.get('content-type')

    // Read the response body as a Buffer
    // const buffer = await response.buffer() // If using node-fetch v2
    // Alternatively, if you're using node-fetch v3 or above, use the following:
    const buffer = await response.arrayBuffer()

    res.set('Content-Type', contentType) // Set the correct content type
    res.send(Buffer.from(buffer)) // Send the image buffer to the client
  } catch (error) {
    console.error(`Failed to fetch image: ${error.message}`)
    res.status(500).send({
      status: 500,
      error: error.message
    })
  }
})
router.get('/image/poster/:id', cookieMiddleware, async (req, res) => {
  const { id } = req.params // Extract the ID from the URL parameter

  try {
    const { cookiesString } = req

    // Fetch the image from the external source
    const response = await fetch(`https://i.animepahe.ru/posters/${id}`, {
      headers: {
        Cookie: cookiesString
      }
    })

    // Check if the response is ok
    if (!response.ok) {
      if (response.status === 403) {
        return res.status(403).send({
          status: 403,
          error: 'Please use webview to enter the website then close the webview window.'
        })
      }
      // Return error status and message without parsing
      return res.status(response.status).send({
        status: response.status,
        error: `HTTP error! Status: ${response.status}`
      })
    }

    // Get the image content type from the response
    const contentType = response.headers.get('content-type')

    // Read the response body as a Buffer
    // const buffer = await response.buffer() // If using node-fetch v2
    // Alternatively, if you're using node-fetch v3 or above, use the following:
    const buffer = await response.arrayBuffer()

    res.set('Content-Type', contentType)
    res.send(Buffer.from(buffer))
  } catch (error) {
    console.error(`Failed to fetch image: ${error.message}`)
    res.status(500).send({
      status: 500,
      error: error.message
    })
  }
})

export { router as animepaheRouter }
