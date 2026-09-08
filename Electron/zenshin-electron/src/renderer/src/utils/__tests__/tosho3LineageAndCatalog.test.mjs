import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const defaultAppRoot = path.resolve(testDirectory, '../../../../..')
const repositoryRoot = path.resolve(
  process.env.ZENSHIN_SOURCE_UNDER_TEST || path.resolve(defaultAppRoot, '../..')
)
const appRoot = path.join(repositoryRoot, 'Electron', 'zenshin-electron')

function source(relativePath) {
  return readFileSync(path.join(appRoot, relativePath), 'utf8')
}


test('source preserves the tosho-xyz v3 API and result schema end to end', () => {
  const manifest = JSON.parse(source('package.json'))
  const lockfile = JSON.parse(source('package-lock.json'))
  assert.equal(manifest.version, '3.0.0')
  assert.equal(lockfile.version, '3.0.0')
  assert.equal(lockfile.packages[''].version, '3.0.0')
  assert.match(source('src/renderer/src/ui/AppLayout.jsx'), /currentVersion\s*=\s*['"]v3\.0\.0['"]/)

  assert.match(source('common/utils.js'), /aHR0cHM6Ly9mZWVkLmFuaW1ldG9zaG8ueHl6/)
  assert.match(source('src/renderer/src/workers/worker.js'), /mizukijs-xyz/)
  assert.match(source('src/renderer/src/utils/api.js'), /\/json\/v1\/search\?q=/)
  assert.match(source('src/renderer/src/utils/api.js'), /encodeURIComponent\(query\)/)
  assert.match(source('src/renderer/src/utils/helper.js'), /return data\.data/)
  assert.match(
    source('src/renderer/src/hooks/useToshoTracker.js'),
    /collectAnimeToshoPages[\s\S]*pageSize:\s*100/
  )

  const episode = source('src/renderer/src/components/Episode.jsx')
  assert.match(episode, /torrent\.magnet/)
  assert.match(episode, /torrent\.size_bytes/)
  assert.match(episode, /torrent\.downloads/)
  assert.doesNotMatch(episode, /torrent\.magnet_uri/)
  assert.doesNotMatch(episode, /torrent\.total_size/)

  const search = source('src/renderer/src/components/CustomSearch.jsx')
  assert.match(search, /torrent\.magnet/)
  assert.match(search, /torrent\?\.downloads/)
  assert.match(search, /torrent\?\.size_bytes/)
  assert.doesNotMatch(search, /torrent\.magnet_uri/)

  const release = source('src/renderer/src/components/NewReleaseCard.jsx')
  assert.match(release, /data\?\.series\?\.anidb_aid/)
  assert.match(release, /data\.date_added/)
})

test('tosho-xyz search pages use the v1 offset contract without replaying page one', () => {
  const apiSource = source('src/renderer/src/utils/api.js')
  const match = apiSource.match(
    /export function SEARCH_TORRENT_TOSHO\(query, page = 1\) \{[\s\S]*?\n\}/
  )
  assert.ok(match, 'SEARCH_TORRENT_TOSHO must remain directly testable')
  const searchTorrentOnTosho = new Function(
    'TOSHO',
    `${match[0].replace('export ', '')}; return SEARCH_TORRENT_TOSHO`
  )('https://feed.animetosho.xyz')

  assert.equal(
    searchTorrentOnTosho('A & B', 1),
    'https://feed.animetosho.xyz/json/v1/search?q=A%20%26%20B&limit=100&qx=1&offset=0'
  )
  assert.equal(
    searchTorrentOnTosho('A & B', 2),
    'https://feed.animetosho.xyz/json/v1/search?q=A%20%26%20B&limit=100&qx=1&offset=100'
  )
})


test('episode fix lists released 1 through 9 and excludes unreleased 10 on that line', async () => {
  const catalogPath = path.join(appRoot, 'src', 'renderer', 'src', 'utils', 'episodeCatalog.mjs')
  assert.ok(
    existsSync(catalogPath),
    'episode catalog fix must exist on the genuine tosho 3.0.0 line'
  )

  const { buildEpisodeCatalog, deriveReleasedEpisodeCount } = await import(
    `${pathToFileURL(catalogPath).href}?source=${encodeURIComponent(repositoryRoot)}`
  )
  const releasedEpisodeCount = deriveReleasedEpisodeCount({
    nextAiringEpisode: { episode: 10 },
    status: 'RELEASING',
    expectedEpisodeCount: 12
  })
  assert.equal(releasedEpisodeCount, 9)

  const mappingEpisode = (episode) => ({
    episode,
    title: { en: `Episode ${episode}` },
    image: `https://example.invalid/${episode}.jpg`,
    anidbEid: episode
  })
  const toshoResult = (episode) => ({
    title: `[SubsPlease] Reliable Example - ${String(episode).padStart(2, '0')} (1080p)`,
    magnet: `magnet:?xt=urn:btih:episode${episode}`,
    size_bytes: 1_000_000 + episode,
    downloads: episode,
    seeders: episode
  })
  const result = buildEpisodeCatalog({
    mappingData: {
      mappings: { anidb_id: 321 },
      episodes: Object.fromEntries([5, 6, 7, 8, 9, 10].map((n) => [n, mappingEpisode(n)]))
    },
    toshoResults: [5, 6, 7, 8, 9, 10].map(toshoResult),
    titleCandidates: ['Reliable Example'],
    toshoScope: 'title',
    releasedEpisodeCount,
    expectedEpisodeCount: 12,
    seriesStatus: 'RELEASING'
  })

  assert.deepEqual(
    result.episodes.map(({ epNum }) => epNum),
    [1, 2, 3, 4, 5, 6, 7, 8, 9]
  )
  assert.equal(
    result.episodes.some(({ epNum }) => epNum === 10),
    false
  )
  assert.equal(
    result.episodes.find(({ epNum }) => epNum === 5).toshoResults[0].magnet,
    'magnet:?xt=urn:btih:episode5'
  )
})
