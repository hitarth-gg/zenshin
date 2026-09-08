const ANILIST_GRAPHQL_URLS = Object.freeze(['https://graphql.anilist.co/*'])
const ANILIST_ORIGIN = 'https://anilist.co'

export function installAniListRequestHeaderOverride(electronSession) {
  electronSession.webRequest.onBeforeSendHeaders(
    { urls: ANILIST_GRAPHQL_URLS },
    ({ requestHeaders = {} }, callback) => {
      const preservedHeaders = Object.fromEntries(
        Object.entries(requestHeaders).filter(
          ([name]) => !['origin', 'referer'].includes(name.toLowerCase())
        )
      )

      callback({
        requestHeaders: {
          ...preservedHeaders,
          Origin: ANILIST_ORIGIN,
          Referer: `${ANILIST_ORIGIN}/`
        }
      })
    }
  )
}
