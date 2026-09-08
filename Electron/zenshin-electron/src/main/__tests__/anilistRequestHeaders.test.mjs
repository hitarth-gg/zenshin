import assert from 'node:assert/strict'
import test from 'node:test'

import { installAniListRequestHeaderOverride } from '../anilistRequestHeaders.mjs'

test('scopes the AniList browser-origin override and preserves other headers', () => {
  let registeredFilter
  let registeredListener
  const electronSession = {
    webRequest: {
      onBeforeSendHeaders(filter, listener) {
        registeredFilter = filter
        registeredListener = listener
      }
    }
  }

  installAniListRequestHeaderOverride(electronSession)
  assert.deepEqual(registeredFilter, { urls: ['https://graphql.anilist.co/*'] })

  let response
  registeredListener(
    { requestHeaders: { Accept: 'application/json', Origin: 'null' } },
    (value) => {
      response = value
    }
  )

  assert.deepEqual(response, {
    requestHeaders: {
      Accept: 'application/json',
      Origin: 'https://anilist.co',
      Referer: 'https://anilist.co/'
    }
  })
})
