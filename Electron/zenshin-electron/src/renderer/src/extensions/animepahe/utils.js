const BASE_URL = 'http://localhost:64621/animepahe'

// http://localhost:64621/animepahe/latest?page=2
//
export const animepaheLatest = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/latest?page=${page}`)
  return response.json()
}
// http://localhost:64621/animepahe/details?id=04980e94-e51c-90c0-7f1c-0c1b760475e4
export const animepaheDetails = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/details?id=${page}`)
  return response.json()
}

// http://localhost:64621/animepahe/episodes?id=04980e94-e51c-90c0-7f1c-0c1b760475e4&page=2
export const animepaheEpisodes = async (id, page = 1) => {
  const response = await fetch(`${BASE_URL}/episodes?id=${id}&page=${page}`)
  return response.json()
}

// http://localhost:64621/animepahe/play?id=4eb5019e-df0f-14da-99fc-fd7a588ad4ad&episode=9bb3a0485a2b7a9360fd6633b04cf56e28c779d5b8fde18997ff7cf808a83696

export const animepahePlay = async (id, episode) => {
  const response = await fetch(`${BASE_URL}/play?id=${id}&episode=${episode}`)
  return response.json()
}
