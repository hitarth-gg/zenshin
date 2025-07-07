import encUrls from '../../../../common/utils.js'
const BASE_URL_JIKAN = 'https://api.jikan.moe/v4'
const BASE_URL_NYAA = encUrls.nyaaApi
export const BASE_URL_ANILIST = 'https://graphql.anilist.co'
const BASE_URL_ANIZIP = encUrls.zenshinSupabase
const TOSHO = encUrls.tosho

export function SEARCH_ANIME(query, limit = 10) {
  return `${BASE_URL_JIKAN}/anime?q=${query}&limit=${limit}`
}

export function SEARCH_TORRENT(query) {
  return `${BASE_URL_NYAA}/?q=${query}&sort=seeders&order=desc&page=1&category=anime`
}

export function SEARCH_TORRENT_TOSHO(query, page = 1) {
  // json?qx=1&q=kaoru&page=1
  console.log(`${TOSHO}/json?qx=1&q=${query}&page=${page}`);

  return `${TOSHO}/json?qx=1&q=${query}&page=${page}`
}

export function TOP_AIRING_ANIME() {
  return `${BASE_URL_JIKAN}/top/anime?&filter=airing&limit=25&sfw=true&type=tv`
}

export function TOP_ANIME(page = 1) {
  return `${BASE_URL_JIKAN}/top/anime?page=${page}&limit=25&sfw=true`
}

export function GET_ANIME_DETAILS_BY_ID(id) {
  return `${BASE_URL_JIKAN}/anime/${id}/full`
}

export function GET_ANIME_MAPPING_BY_ANILIST_ID(anilist_id, anidb = false) {
  console.log(`${BASE_URL_ANIZIP}/mappings?anilist_id=${anilist_id}`)
  if (anidb) return `${BASE_URL_ANIZIP}/mappings?anidb_id=${anilist_id}`
  return `${BASE_URL_ANIZIP}/mappings?anilist_id=${anilist_id}`
}

export function GET_ANIME_EPISODES_BY_ID(id) {
  return `${BASE_URL_JIKAN}/anime/${id}/episodes`
}

export function GET_TOSHO_RSS(packer = '"[SubsPlease]"') {
  return `${TOSHO}/json?qx=1&q=${packer}`
}

export function GET_TOSHO_RSS_BY_QUERY(quality = 'all', aids, eids) {
  if (eids === 0 || eids === null) {
    if (quality.toLowerCase() === 'all') return `${TOSHO}/json?qx=1&aids=${aids}`
    return `${TOSHO}/json?qx=1&q=${quality}&aids=${aids}`
  }
  if (quality.toLowerCase() === 'all') return `${TOSHO}/json?qx=1&aids=${aids}&eids=${eids}`
  return `${TOSHO}/json?qx=1&q=${quality}&aids=${aids}&eids=${eids}`
}
