// jikan api
const BASE_URL_JIKAN = 'https://api.jikan.moe/v4'
const BASE_URL_NYAA = 'https://nyaaapi.onrender.com/nyaa'

export function SEARCH_ANIME(query, limit=10) {
  return `${BASE_URL_JIKAN}/anime?q=${query}&limit=${limit}`
}

// 'https://nyaaapi.onrender.com/nyaa?q=one%20piece&sort=seeders&order=desc&page=1'
export function SEARCH_TORRENT(query) {
  return `${BASE_URL_NYAA}/?q=${query}&sort=seeders&order=desc&page=1&category=anime`
}

// https://api.jikan.moe/v4/top/anime?&filter=airing&limit=25
export function TOP_AIRING_ANIME() {
  return `${BASE_URL_JIKAN}/top/anime?&filter=airing&limit=25&sfw=true&type=tv`
}

// https://api.jikan.moe/v4/top/anime
// export function TOP_ANIME() {
//   return `${BASE_URL_JIKAN}/top/anime`
// }

// https://api.jikan.moe/v4/top/anime
export function TOP_ANIME(page = 1) {
  return `${BASE_URL_JIKAN}/top/anime?page=${page}&limit=25&sfw=true`
}

// https://api.jikan.moe/v4/anime/{id}/full
export function GET_ANIME_DETAILS_BY_ID(id) {
  return `${BASE_URL_JIKAN}/anime/${id}/full`
}

// https://api.jikan.moe/v4/anime/{id}/episodes
export function GET_ANIME_EPISODES_BY_ID(id) {
  return `${BASE_URL_JIKAN}/anime/${id}/episodes`
}
