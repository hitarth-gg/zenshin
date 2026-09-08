const SOURCE_PRECEDENCE = ['anizip', 'anilist', 'animetosho', 'anilist-schedule']

function toEpisodeNumber(value) {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value > 0 ? value : null
  }
  if (typeof value !== 'string' || !/^\d+$/.test(value.trim())) return null
  const number = Number(value)
  return Number.isSafeInteger(number) && number > 0 ? number : null
}

function toReleasedEpisodeCount(value) {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value >= 0 ? value : null
  }
  if (typeof value !== 'string' || !/^\d+$/.test(value.trim())) return null
  const number = Number(value)
  return Number.isSafeInteger(number) ? number : null
}

export function deriveReleasedEpisodeCount({
  nextAiringEpisode = null,
  status = null,
  expectedEpisodeCount = null
} = {}) {
  if (status === 'FINISHED') return toReleasedEpisodeCount(expectedEpisodeCount)

  const nextEpisode = toEpisodeNumber(nextAiringEpisode?.episode)
  if (nextEpisode !== null) return nextEpisode - 1
  return null
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function mappingTitle(title) {
  if (typeof title === 'string') return nonEmptyString(title)
  if (!title || typeof title !== 'object') return null
  return (
    nonEmptyString(title.en) ||
    nonEmptyString(title['x-jat']) ||
    nonEmptyString(title.jp) ||
    nonEmptyString(title.ja)
  )
}

function normalizeMappingEpisodes(mappingData, rejected) {
  const episodes = mappingData?.episodes
  if (!episodes || (typeof episodes !== 'object' && !Array.isArray(episodes))) return []
  const aid = mappingData?.mappings?.anidb_id ?? null

  return Object.values(episodes).flatMap((episode) => {
    const epNum = toEpisodeNumber(episode?.episode)
    if (!epNum) {
      rejected.mapping += 1
      return []
    }
    return [
      {
        epNum,
        title: mappingTitle(episode.title),
        thumbnail: nonEmptyString(episode.image),
        airdate: nonEmptyString(episode.airdate),
        overview: nonEmptyString(episode.overview),
        aids: aid,
        eids: episode.anidbEid ?? null,
        sources: ['anizip'],
        toshoResults: []
      }
    ]
  })
}

function normalizeAniListEpisodes(episodes, rejected) {
  if (!Array.isArray(episodes)) return []
  return episodes.flatMap((episode) => {
    const rawTitle = nonEmptyString(episode?.title)
    const match = rawTitle?.match(/^Episode\s+(\d+)(?:\s*[-:]\s*(.+))?$/i)
    const epNum = toEpisodeNumber(match?.[1])
    if (!epNum) {
      rejected.anilist += 1
      return []
    }
    return [
      {
        epNum,
        title: nonEmptyString(match?.[2]),
        thumbnail: nonEmptyString(episode.thumbnail),
        airdate: null,
        overview: null,
        aids: null,
        eids: null,
        sources: ['anilist'],
        toshoResults: []
      }
    ]
  })
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function titlePattern(title) {
  const tokens = title
    .normalize('NFKC')
    .trim()
    .split(/[\s\p{P}\p{S}]+/u)
    .filter(Boolean)
    .map(escapeRegex)
  return tokens.length ? tokens.join(`[\\s\\p{P}\\p{S}]+`) : null
}

function titleAliases(titleCandidates) {
  const aliases = []
  const expectedSeasons = new Set()

  for (const candidate of Array.isArray(titleCandidates) ? titleCandidates : []) {
    const title = nonEmptyString(candidate)
    if (!title) continue
    aliases.push(title)

    const seasonSuffix = title.match(/\s+(?:season|part)\s+(\d+)$/i)
    const ordinalSuffix = title.match(/\s+(\d+)(?:st|nd|rd|th)\s+season$/i)
    const suffix = seasonSuffix || ordinalSuffix
    if (suffix) {
      expectedSeasons.add(Number(suffix[1]))
      aliases.push(title.slice(0, suffix.index).trim())
    }
  }

  return {
    aliases: [...new Set(aliases)].sort((a, b) => b.length - a.length),
    expectedSeasons
  }
}

function hasEpisodeRange(title) {
  const tokenBoundary = '(?=$|[\\s\\p{P}\\p{S}])'
  return (
    new RegExp(
      `S\\d{1,2}E\\d{1,4}\\s*(?:-|~|–|—|\\+|/|&|,)\\s*(?:S\\d{1,2})?E?\\d{1,4}${tokenBoundary}`,
      'iu'
    ).test(title) ||
    new RegExp(
      `(?:^|\\s[-–—]\\s*)\\d{1,4}\\s*(?:-|~|–|—|\\+|/|&|,)\\s*(?:E\\s*)?\\d{1,4}${tokenBoundary}`,
      'iu'
    ).test(title) ||
    new RegExp(`S\\d{1,2}E\\d{1,4}\\s+(?:S\\d{1,2})?E\\d{1,4}${tokenBoundary}`, 'iu').test(title) ||
    new RegExp(
      `(?:episode|ep)[\\s\\p{P}\\p{S}]*\\d{1,4}\\s*(?:(?:-|~|–|—|\\+|/|&|,)\\s*|\\s+)(?:(?:episode|ep|e)[\\s\\p{P}\\p{S}]*)?\\d{1,4}${tokenBoundary}`,
      'iu'
    ).test(title) ||
    new RegExp(`(?:^|\\s[-–—]\\s*)\\d{1,4}\\s+\\d{1,4}${tokenBoundary}`, 'u').test(title) ||
    new RegExp(`(?:^|[\\s\\p{P}\\p{S}])\\d{1,4}\\.\\d+${tokenBoundary}`, 'u').test(title)
  )
}

function hasSpecialMarker(title) {
  return /(?:^|[\s\p{P}\p{S}])(?:batch|complete|ova|oad|ona|specials?|sp\d*|ncop|nced)(?=$|[\s\p{P}\p{S}])/iu.test(
    title
  )
}

function parseEpisodeRemainder(remainder, expectedSeasons, titleScoped) {
  const seasonPattern = titleScoped
    ? /^[\s\p{P}\p{S}]*S(\d{1,2})E(\d{1,4})(?:v\d+)?(?=$|[\s\p{P}\p{S}])/iu
    : /(?:^|[\s\p{P}\p{S}])S(\d{1,2})E(\d{1,4})(?:v\d+)?(?=$|[\s\p{P}\p{S}])/iu
  const seasonEpisode = remainder.match(seasonPattern)
  if (seasonEpisode) {
    const season = Number(seasonEpisode[1])
    if (titleScoped) {
      const allowed = expectedSeasons.size ? expectedSeasons.has(season) : season === 1
      if (!allowed) return null
    }
    return toEpisodeNumber(seasonEpisode[2])
  }

  const explicitEpisodePattern = titleScoped
    ? /^[\s\p{P}\p{S}]*(?:episode|ep)[\s\p{P}\p{S}]*(\d{1,4})(?:v\d+)?(?=$|[\s\p{P}\p{S}])/iu
    : /(?:^|[\s\p{P}\p{S}])(?:episode|ep)[\s\p{P}\p{S}]*(\d{1,4})(?:v\d+)?(?=$|[\s\p{P}\p{S}])/iu
  const explicitEpisode = remainder.match(explicitEpisodePattern)
  if (explicitEpisode) return toEpisodeNumber(explicitEpisode[1])

  if (titleScoped) {
    const plainEpisode = remainder.match(/^\s*[-–—]\s*(\d{1,4})(?:v\d+)?(?=$|[\s\p{P}\p{S}])/u)
    if (plainEpisode) return toEpisodeNumber(plainEpisode[1])
  } else {
    const plainEpisode = remainder.match(/(?:^|\s[-–—]\s*)(\d{1,4})(?:v\d+)?(?=$|[\s\p{P}\p{S}])/u)
    if (plainEpisode) return toEpisodeNumber(plainEpisode[1])
  }

  return null
}

/**
 * Parse only identities suitable for a numbered catalog. `aid` scope means AnimeTosho
 * already constrained the series. `title` scope additionally requires a candidate title
 * prefix and accepts SxxExx only for season 1 or an explicitly named season.
 */
export function parseAnimeToshoEpisodeNumber(
  releaseTitle,
  { titleCandidates = [], scope = 'title' } = {}
) {
  let title = nonEmptyString(releaseTitle)
  if (!title) return null

  while (/^\s*\[[^\]]+\]\s*/.test(title)) {
    title = title.replace(/^\s*\[[^\]]+\]\s*/, '')
  }

  if (scope === 'aid') {
    if (hasEpisodeRange(title) || hasSpecialMarker(title)) return null
    return parseEpisodeRemainder(title, new Set(), false)
  }
  if (scope !== 'title') return null

  const { aliases, expectedSeasons } = titleAliases(titleCandidates)
  for (const alias of aliases) {
    const pattern = titlePattern(alias)
    if (!pattern) continue
    const match = title.match(new RegExp(`^${pattern}(?=$|[\\s\\p{P}\\p{S}])`, 'iu'))
    if (!match) continue
    const remainder = title.slice(match[0].length)
    if (hasEpisodeRange(remainder) || hasSpecialMarker(remainder)) return null
    const episodeNumber = parseEpisodeRemainder(remainder, expectedSeasons, true)
    if (episodeNumber) return episodeNumber
  }
  return null
}

function normalizeToshoEpisodes(results, options, rejected) {
  if (!Array.isArray(results)) return []
  const grouped = new Map()

  for (const result of results) {
    const epNum = parseAnimeToshoEpisodeNumber(result?.title, options)
    if (!epNum) {
      rejected.animetosho += 1
      continue
    }
    if (!grouped.has(epNum)) grouped.set(epNum, [])
    grouped.get(epNum).push(result)
  }

  return [...grouped.entries()].map(([epNum, toshoResults]) => ({
    epNum,
    title: null,
    thumbnail: null,
    airdate: null,
    overview: null,
    aids: null,
    eids: null,
    sources: ['animetosho'],
    toshoResults
  }))
}

function normalizeScheduleEpisodes(releasedEpisodeCount) {
  if (releasedEpisodeCount === null) return []
  return Array.from({ length: releasedEpisodeCount }, (_, index) => ({
    epNum: index + 1,
    title: null,
    thumbnail: null,
    airdate: null,
    overview: null,
    aids: null,
    eids: null,
    sources: ['anilist-schedule'],
    toshoResults: []
  }))
}

function mergeEpisode(existing, incoming) {
  for (const field of ['title', 'thumbnail', 'airdate', 'overview', 'aids', 'eids']) {
    if (existing[field] == null && incoming[field] != null) existing[field] = incoming[field]
  }
  for (const source of incoming.sources) {
    if (!existing.sources.includes(source)) existing.sources.push(source)
  }
  if (incoming.toshoResults.length) existing.toshoResults.push(...incoming.toshoResults)
}

function catalogNotice({
  mappingData,
  mappingError,
  mappingLoading,
  mappedCount,
  mappingIncomplete,
  fallbackAdded,
  releaseBoundaryMissing,
  episodes
}) {
  const hasCatalog = episodes.length > 0
  const errorMessage =
    mappingError instanceof Error ? mappingError.message : String(mappingError || '')

  if (releaseBoundaryMissing) {
    return {
      kind: 'release-boundary-unavailable',
      message:
        'The released-episode boundary is unavailable, so no episode links are shown. Retry after AniList schedule metadata is available.'
    }
  }

  if (mappingError) {
    if (!hasCatalog) {
      return {
        kind: 'unavailable',
        message:
          'Episode mapping is unavailable and no trusted fallback catalog could be formed. Retry, or use manual AnimeTosho search.'
      }
    }
    if (/429|rate.?limit|too many requests/i.test(errorMessage)) {
      return {
        kind: 'rate-limited',
        message: 'Episode mapping is rate limited. Showing verified fallback episodes; retry later.'
      }
    }
    return {
      kind: 'mapping-error',
      message: 'Episode mapping is unavailable. Showing verified fallback episodes; retry later.'
    }
  }

  if (mappingLoading) return null
  if (!hasCatalog) {
    return {
      kind: 'unavailable',
      message:
        'No trusted numbered episode catalog is available. Retry, or use manual AnimeTosho search.'
    }
  }
  if (mappingData && mappedCount === 0) {
    return {
      kind: 'mapping-empty',
      message: 'No mapped episodes were returned. Showing verified fallback episodes.'
    }
  }
  if (mappedCount > 0 && fallbackAdded > 0) {
    return {
      kind: 'partial',
      message: 'Episode mapping appears incomplete. Showing merged verified fallback episodes.'
    }
  }
  if (mappedCount > 0 && mappingIncomplete) {
    return {
      kind: 'partial-unresolved',
      message:
        'Episode mapping appears incomplete and no additional trusted fallback episodes were found. Retry, or use manual AnimeTosho search.'
    }
  }
  return null
}

export async function collectAnimeToshoPages(fetchPage, { maxPages = 3, pageSize = 75 } = {}) {
  if (typeof fetchPage !== 'function') throw new TypeError('fetchPage must be a function')
  const pageLimit = toEpisodeNumber(maxPages) || 1
  const expectedPageSize = toEpisodeNumber(pageSize) || 75
  const results = []

  for (let page = 1; page <= pageLimit; page += 1) {
    const pageResults = await fetchPage(page)
    if (!Array.isArray(pageResults)) {
      throw new TypeError('AnimeTosho page response must be an array')
    }
    results.push(...pageResults)
    if (pageResults.length < expectedPageSize) break
  }

  return results
}

/**
 * Build one catalog in fixed precedence order: AniZip metadata, AniList streaming
 * metadata, then unambiguous AnimeTosho release identities. Duplicate episode numbers
 * are merged; lower-precedence sources fill only missing fields.
 */
export function buildEpisodeCatalog({
  mappingData = null,
  mappingError = null,
  mappingLoading = false,
  anilistEpisodes = [],
  toshoResults = [],
  titleCandidates = [],
  toshoScope = 'title',
  releasedEpisodeCount = null,
  expectedEpisodeCount = null,
  seriesStatus = null
} = {}) {
  const rejected = { mapping: 0, anilist: 0, animetosho: 0 }
  const trustedReleasedCount =
    toReleasedEpisodeCount(releasedEpisodeCount) ??
    deriveReleasedEpisodeCount({ status: seriesStatus, expectedEpisodeCount })
  const releaseBoundaryMissing = trustedReleasedCount === null
  const withinReleasedCount = (episode) =>
    !releaseBoundaryMissing &&
    (trustedReleasedCount === null || episode.epNum <= trustedReleasedCount)
  const mapped = normalizeMappingEpisodes(mappingData, rejected).filter(withinReleasedCount)
  const anilist = normalizeAniListEpisodes(anilistEpisodes, rejected).filter(withinReleasedCount)
  const animetosho = normalizeToshoEpisodes(
    toshoResults,
    { titleCandidates, scope: toshoScope },
    rejected
  ).filter(withinReleasedCount)
  const schedule = normalizeScheduleEpisodes(trustedReleasedCount)
  const discoveredNumbers = new Set(
    [...mapped, ...anilist, ...animetosho].map(({ epNum }) => epNum)
  )
  const scheduleAdded = schedule.filter(({ epNum }) => !discoveredNumbers.has(epNum)).length
  const merged = new Map()

  for (const episode of [...mapped, ...anilist, ...animetosho, ...schedule]) {
    if (!merged.has(episode.epNum)) merged.set(episode.epNum, { ...episode })
    else mergeEpisode(merged.get(episode.epNum), episode)
  }

  const mappedNumbers = new Set(mapped.map(({ epNum }) => epNum))
  const orderedMappedNumbers = [...mappedNumbers].sort((a, b) => a - b)
  const hasInternalMappingGap = orderedMappedNumbers.some((epNum, index) => epNum !== index + 1)
  const trustedExpectedCount = toEpisodeNumber(expectedEpisodeCount)
  const finishedMappingIsShort =
    seriesStatus === 'FINISHED' &&
    trustedExpectedCount !== null &&
    mappedNumbers.size < trustedExpectedCount
  const releasedMappingIsShort =
    trustedReleasedCount !== null && mappedNumbers.size < trustedReleasedCount
  const mappingIncomplete =
    hasInternalMappingGap || finishedMappingIsShort || releasedMappingIsShort
  const episodes = [...merged.values()]
    .map((episode) => ({
      ...episode,
      title: episode.title || `Episode ${episode.epNum}`,
      sources: SOURCE_PRECEDENCE.filter((source) => episode.sources.includes(source))
    }))
    .sort((a, b) => a.epNum - b.epNum)
  const fallbackAdded = episodes.filter(({ epNum }) => !mappedNumbers.has(epNum)).length
  const diagnostics = {
    rejected,
    releasedEpisodeCount: trustedReleasedCount,
    releaseBoundaryMissing,
    scheduleAdded,
    sourceCounts: {
      anizip: mapped.length,
      anilist: anilist.length,
      animetosho: animetosho.length,
      anilistSchedule: schedule.length
    },
    fallbackAdded
  }

  return {
    episodes,
    diagnostics,
    notice: catalogNotice({
      mappingData,
      mappingError,
      mappingLoading,
      mappedCount: mapped.length,
      mappingIncomplete,
      fallbackAdded,
      releaseBoundaryMissing,
      episodes
    })
  }
}

export function selectAnimeToshoQueryTitle({ english, romaji, native } = {}) {
  return nonEmptyString(english) || nonEmptyString(romaji) || nonEmptyString(native)
}

export function filterAnimeToshoResults(results, { quality = 'All', dualAudio = false } = {}) {
  if (!Array.isArray(results)) return []
  const qualityNeedle = nonEmptyString(quality)?.toLowerCase() || 'all'

  return results.filter((result) => {
    if (qualityNeedle !== 'all') {
      const title = nonEmptyString(result?.title)
      if (!title || !title.toLowerCase().includes(qualityNeedle)) return false
    }
    if (!dualAudio) return true
    const title = nonEmptyString(result?.title)
    if (!title) return false
    const normalizedTitle = title.toLowerCase()
    return (
      normalizedTitle.includes('dual audio') ||
      normalizedTitle.includes('dual-audio') ||
      normalizedTitle.includes('english dub') ||
      normalizedTitle.includes('eng dub')
    )
  })
}
