import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  buildEpisodeCatalog,
  collectAnimeToshoPages,
  deriveReleasedEpisodeCount,
  filterAnimeToshoResults,
  parseAnimeToshoEpisodeNumber,
  selectAnimeToshoQueryTitle
} from '../episodeCatalog.mjs'

const fixtureUrl = new URL('./fixtures/episodes-5-11.animetosho.json', import.meta.url)
const fallbackFixture = JSON.parse(readFileSync(fixtureUrl, 'utf8'))

function mappingEpisode(episode, title = `Mapped ${episode}`) {
  return {
    episode,
    title: { en: title },
    image: `https://images.example/${episode}.jpg`,
    airdate: `2026-09-${String(episode).padStart(2, '0')}`,
    overview: `Overview ${episode}`,
    anidbEid: 9000 + episode
  }
}

test('merges mapping, AniList, and AnimeTosho by integer episode with explicit precedence', () => {
  const torrent = {
    id: 2,
    title: '[SubsPlease] Reliable Example - 02 (1080p).mkv',
    magnet: 'magnet:?xt=urn:btih:episode02'
  }
  const result = buildEpisodeCatalog({
    mappingData: {
      mappings: { anidb_id: 321 },
      episodes: { 1: mappingEpisode(1, 'Mapping title') }
    },
    anilistEpisodes: [
      { title: 'Episode 1 - AniList title', thumbnail: 'https://anilist.example/1.jpg' },
      { title: 'Episode 2 - Second episode', thumbnail: 'https://anilist.example/2.jpg' }
    ],
    toshoResults: [torrent],
    titleCandidates: ['Reliable Example'],
    toshoScope: 'aid',
    releasedEpisodeCount: 2
  })

  assert.deepEqual(
    result.episodes.map(({ epNum }) => epNum),
    [1, 2]
  )
  assert.equal(result.episodes[0].title, 'Mapping title')
  assert.equal(result.episodes[0].aids, 321)
  assert.equal(result.episodes[0].eids, 9001)
  assert.deepEqual(result.episodes[0].sources, ['anizip', 'anilist', 'anilist-schedule'])
  assert.equal(result.episodes[1].title, 'Second episode')
  assert.deepEqual(result.episodes[1].sources, ['anilist', 'animetosho', 'anilist-schedule'])
  assert.deepEqual(result.episodes[1].toshoResults, [torrent])
})

test('orders and deduplicates entries while rejecting malformed or non-integer episode identities', () => {
  const result = buildEpisodeCatalog({
    mappingData: {
      episodes: {
        bad: mappingEpisode('special'),
        zero: mappingEpisode(0),
        fractional: mappingEpisode(2.5),
        three: mappingEpisode('3')
      }
    },
    anilistEpisodes: [
      { title: 'Trailer 4' },
      { title: 'Episode three' },
      { title: 'Episode 1 - First' },
      { title: 'Episode 3 - Lower-priority duplicate' }
    ],
    toshoResults: [
      { title: '[Group] Different Series - 02 (1080p).mkv' },
      { title: '[Group] Reliable Example - S01 (1080p batch).mkv' },
      { title: '[Group] Reliable Example - 04-06 (1080p batch).mkv' }
    ],
    titleCandidates: ['Reliable Example'],
    toshoScope: 'title',
    releasedEpisodeCount: 3
  })

  assert.deepEqual(
    result.episodes.map(({ epNum }) => epNum),
    [1, 2, 3]
  )
  assert.equal(result.episodes[2].title, 'Mapped 3')
  assert.equal(result.diagnostics.rejected.mapping, 3)
  assert.equal(result.diagnostics.rejected.anilist, 2)
  assert.equal(result.diagnostics.rejected.animetosho, 3)
})

test('source-level AnimeTosho fallback fixture exposes episodes 5 through 11', () => {
  const result = buildEpisodeCatalog({
    mappingData: {
      episodes: {
        1: mappingEpisode(1),
        2: mappingEpisode(2),
        3: mappingEpisode(3),
        4: mappingEpisode(4)
      }
    },
    anilistEpisodes: [],
    toshoResults: fallbackFixture.results,
    titleCandidates: [fallbackFixture.canonicalTitle],
    toshoScope: 'title',
    releasedEpisodeCount: 11,
    expectedEpisodeCount: 11
  })

  assert.deepEqual(
    result.episodes.map(({ epNum }) => epNum),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  )
  assert.deepEqual(
    result.episodes.slice(4).map(({ epNum, title, sources }) => ({ epNum, title, sources })),
    [5, 6, 7, 8, 9, 10, 11].map((epNum) => ({
      epNum,
      title: `Episode ${epNum}`,
      sources: ['animetosho', 'anilist-schedule']
    }))
  )
  assert.equal(result.notice.kind, 'partial')
  assert.match(result.notice.message, /merged verified fallback episodes/i)
})

test('authoritative AniList metadata yields only a defensible released episode count', () => {
  assert.equal(deriveReleasedEpisodeCount({ nextAiringEpisode: { episode: 12 } }), 11)
  assert.equal(deriveReleasedEpisodeCount({ nextAiringEpisode: { episode: 1 } }), 0)
  assert.equal(deriveReleasedEpisodeCount({ status: 'FINISHED', expectedEpisodeCount: 13 }), 13)
  assert.equal(
    deriveReleasedEpisodeCount({
      status: 'FINISHED',
      expectedEpisodeCount: 13,
      nextAiringEpisode: { episode: 5 }
    }),
    13
  )
  assert.equal(deriveReleasedEpisodeCount({ status: 'RELEASING', expectedEpisodeCount: 13 }), null)
  assert.equal(deriveReleasedEpisodeCount({ nextAiringEpisode: { episode: '12' } }), 11)
  assert.equal(deriveReleasedEpisodeCount({ nextAiringEpisode: { episode: 0 } }), null)
})

test('authoritative released count forms a complete ordered catalog and excludes future entries', () => {
  const result = buildEpisodeCatalog({
    mappingData: {
      mappings: { anidb_id: 321 },
      episodes: Object.fromEntries(
        [5, 6, 7, 8, 9, 10, 11, 12].map((episode) => [episode, mappingEpisode(episode)])
      )
    },
    anilistEpisodes: [
      { title: 'Episode 8 - Eight' },
      { title: 'Episode 9 - Nine' },
      { title: 'Episode 10 - Ten' },
      { title: 'Episode 11 - Eleven' },
      { title: 'Episode 12 - Future' }
    ],
    releasedEpisodeCount: 11,
    expectedEpisodeCount: 12,
    seriesStatus: 'RELEASING'
  })

  assert.deepEqual(
    result.episodes.map(({ epNum }) => epNum),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  )
  assert.deepEqual(
    result.episodes.slice(0, 4).map(({ sources }) => sources),
    [['anilist-schedule'], ['anilist-schedule'], ['anilist-schedule'], ['anilist-schedule']]
  )
  assert.equal(result.diagnostics.releasedEpisodeCount, 11)
  assert.equal(result.diagnostics.scheduleAdded, 4)
  assert.equal(result.notice.kind, 'partial')
})

test('catalog fails closed whenever no released-episode boundary is available', () => {
  for (const seriesStatus of ['RELEASING', null, undefined, '']) {
    const result = buildEpisodeCatalog({
      mappingData: {
        mappings: { anidb_id: 321 },
        episodes: {
          1: mappingEpisode(1),
          12: mappingEpisode(12)
        }
      },
      anilistEpisodes: [{ title: 'Episode 12 - Future' }],
      toshoResults: [{ title: '[Group] Show - 12 [1080p]', magnet: 'magnet:?xt=12' }],
      titleCandidates: ['Show'],
      toshoScope: 'Show',
      releasedEpisodeCount: null,
      expectedEpisodeCount: 12,
      seriesStatus
    })

    assert.deepEqual(result.episodes, [], `status ${String(seriesStatus)} must not fail open`)
    assert.equal(result.diagnostics.releaseBoundaryMissing, true)
    assert.equal(result.notice.kind, 'release-boundary-unavailable')
  }
})

test('collects bounded AnimeTosho catalog pages until the first short page', async () => {
  const requestedPages = []
  const pages = {
    1: [{ id: 1 }, { id: 2 }],
    2: [{ id: 3 }]
  }
  const results = await collectAnimeToshoPages(
    async (page) => {
      requestedPages.push(page)
      return pages[page] || []
    },
    { maxPages: 5, pageSize: 2 }
  )

  assert.deepEqual(requestedPages, [1, 2])
  assert.deepEqual(
    results.map(({ id }) => id),
    [1, 2, 3]
  )
})

test('classifies mapping errors, rate limits, empty mappings, and unavailable catalogs actionably', () => {
  const fallback = [{ title: 'Episode 1 - Fallback' }]

  const rateLimited = buildEpisodeCatalog({
    mappingError: new Error('Too many requests: rate-limited (429)'),
    anilistEpisodes: fallback,
    releasedEpisodeCount: 1
  })
  assert.equal(rateLimited.notice.kind, 'rate-limited')
  assert.match(rateLimited.notice.message, /retry/i)
  assert.deepEqual(
    rateLimited.episodes.map(({ epNum }) => epNum),
    [1]
  )

  const failed = buildEpisodeCatalog({
    mappingError: new Error('network unavailable'),
    anilistEpisodes: fallback,
    releasedEpisodeCount: 1
  })
  assert.equal(failed.notice.kind, 'mapping-error')
  assert.match(failed.notice.message, /fallback/i)

  const empty = buildEpisodeCatalog({
    mappingData: { episodes: {} },
    anilistEpisodes: fallback,
    releasedEpisodeCount: 1
  })
  assert.equal(empty.notice.kind, 'mapping-empty')

  const incompleteMapping = buildEpisodeCatalog({
    mappingData: {
      episodes: { 1: mappingEpisode(1), 3: mappingEpisode(3) }
    },
    releasedEpisodeCount: 3
  })
  assert.equal(incompleteMapping.notice.kind, 'partial')
  assert.deepEqual(
    incompleteMapping.episodes.map(({ epNum }) => epNum),
    [1, 2, 3]
  )

  const finishedPartial = buildEpisodeCatalog({
    mappingData: {
      episodes: { 1: mappingEpisode(1), 2: mappingEpisode(2) }
    },
    expectedEpisodeCount: 3,
    seriesStatus: 'FINISHED'
  })
  assert.equal(finishedPartial.notice.kind, 'partial')
  assert.deepEqual(
    finishedPartial.episodes.map(({ epNum }) => epNum),
    [1, 2, 3]
  )

  const unavailable = buildEpisodeCatalog({
    mappingError: new Error('network unavailable'),
    anilistEpisodes: [{ title: 'Special feature' }],
    toshoResults: [{ title: 'ambiguous batch S01' }],
    releasedEpisodeCount: 0
  })
  assert.equal(unavailable.notice.kind, 'unavailable')
  assert.match(unavailable.notice.message, /manual AnimeTosho search/i)
})

test('parses only unambiguous AnimeTosho episode forms for the selected scope', () => {
  assert.equal(
    parseAnimeToshoEpisodeNumber('[SubsPlease] Reliable Example - 11 (1080p).mkv', {
      titleCandidates: ['Reliable Example'],
      scope: 'title'
    }),
    11
  )
  assert.equal(
    parseAnimeToshoEpisodeNumber('Reliable.Example.S01E09.1080p.WEB-DL.mkv', {
      titleCandidates: ['Reliable Example'],
      scope: 'title'
    }),
    9
  )
  assert.equal(
    parseAnimeToshoEpisodeNumber('[Group] Reliable Example Part 2 - 11 (1080p).mkv', {
      titleCandidates: ['Reliable Example Part 2'],
      scope: 'title'
    }),
    11
  )
  assert.equal(
    parseAnimeToshoEpisodeNumber('Reliable Example S02E09 1080p.mkv', {
      titleCandidates: ['Reliable Example'],
      scope: 'title'
    }),
    null
  )
  assert.equal(
    parseAnimeToshoEpisodeNumber('Reliable Example [1080p] [Dual Audio].mkv', {
      titleCandidates: ['Reliable Example'],
      scope: 'title'
    }),
    null
  )
  assert.equal(
    parseAnimeToshoEpisodeNumber('Reliable Example (2026) - S01 batch.mkv', {
      titleCandidates: ['Reliable Example'],
      scope: 'title'
    }),
    null
  )
  assert.equal(
    parseAnimeToshoEpisodeNumber('[Group] Reliable Example Movie Episode 5 (1080p).mkv', {
      titleCandidates: ['Reliable Example'],
      scope: 'title'
    }),
    null
  )
  for (const ambiguousTitle of [
    '[Group] Reliable Example - 05+06 (1080p).mkv',
    '[Group] Reliable Example - 05/06 (1080p).mkv',
    '[Group] Reliable Example - 05 & 06 (1080p).mkv',
    '[Group] Reliable Example - 05, 06 (1080p).mkv',
    '[Group] Reliable Example - 05 06 (1080p).mkv',
    '[Group] Reliable Example - 05.5 (1080p).mkv',
    '[Group] Reliable Example S01E05+E06 (1080p).mkv',
    '[Group] Reliable Example S01E05/E06 (1080p).mkv',
    '[Group] Reliable Example Episode 05/06 (1080p).mkv',
    '[Group] Reliable Example Episode 05-06 (1080p).mkv',
    '[Group] Reliable Example Ep 05 & 06 (1080p).mkv',
    '[Group] Reliable Example Episode 05, 06 (1080p).mkv',
    '[Group] Reliable Example Episode 05 06 (1080p).mkv',
    '[Group] Reliable Example Episode 05+06 (1080p).mkv',
    '[Group] Reliable Example Episode 05 Episode 06 (1080p).mkv',
    '[Group] Reliable Example - 05 OVA.mkv',
    '[Group] Reliable Example - 05 Batch.mkv',
    '[Group] Reliable Example - 123ABCDEF.mkv'
  ]) {
    for (const scope of ['title', 'aid']) {
      assert.equal(
        parseAnimeToshoEpisodeNumber(ambiguousTitle, {
          titleCandidates: ['Reliable Example'],
          scope
        }),
        null,
        `${scope}: ${ambiguousTitle}`
      )
    }
  }
  assert.equal(
    parseAnimeToshoEpisodeNumber('Unrelated Show S02E07 1080p.mkv', {
      titleCandidates: ['Reliable Example'],
      scope: 'aid'
    }),
    7
  )
  assert.equal(
    parseAnimeToshoEpisodeNumber('Unrelated Show S01E01-E12 batch.mkv', {
      titleCandidates: ['Reliable Example'],
      scope: 'aid'
    }),
    null
  )
})

test('selects a stable title query and keeps the requested season explicit', () => {
  assert.equal(
    selectAnimeToshoQueryTitle({
      english: 'Reliable Example Season 2',
      romaji: 'Reliable Example 2nd Season',
      native: '信頼できる例'
    }),
    'Reliable Example Season 2'
  )
  assert.equal(selectAnimeToshoQueryTitle({ romaji: 'Reliable Example' }), 'Reliable Example')
  assert.equal(selectAnimeToshoQueryTitle({ english: '   ', native: '' }), null)
})

test('applies quality and dual-audio filters to cached AnimeTosho fallback results', () => {
  const results = [
    { id: 1, title: '[Group] Reliable Example - 11 (1080p) [Dual Audio].mkv' },
    { id: 2, title: '[Group] Reliable Example - 11 (1080p).mkv' },
    { id: 3, title: '[Group] Reliable Example - 11 (720p) [English Dub].mkv' },
    { id: 4, title: null }
  ]

  assert.deepEqual(
    filterAnimeToshoResults(results, { quality: '1080p', dualAudio: true }).map(({ id }) => id),
    [1]
  )
  assert.deepEqual(
    filterAnimeToshoResults(results, { quality: 'All', dualAudio: false }).map(({ id }) => id),
    [1, 2, 3, 4]
  )
})
