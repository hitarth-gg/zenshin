let BASE_URL = 'http://localhost:64621/animepahe'

async function backendPort() {
  const response = await window.api.getSettingsJson()
  const backendPort = response.backendPort
  BASE_URL = `http://localhost:${backendPort}/animepahe`
}

backendPort()

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
  // const response = await fetch(`${BASE_URL}/getallepisodes?id=${id}&page=${page}`)
  const response = await fetch(`${BASE_URL}/getallepisodes?id=${id}`)
  const data = await response.json()
  return { data: data.episodes }

  // return response.json()
}

// http://localhost:64621/animepahe/play?id=4eb5019e-df0f-14da-99fc-fd7a588ad4ad&episode=9bb3a0485a2b7a9360fd6633b04cf56e28c779d5b8fde18997ff7cf808a83696

export const animepahePlay = async (id, episode) => {
  const response = await fetch(`${BASE_URL}/play?id=${id}&episode=${episode}`)
  return response.json()
}

// http://localhost:64621/animepahe/search?q=na
export const animepaheSearch = async (query) => {
  const response = await fetch(`${BASE_URL}/search?q=${query}`)
  return response.json()
}
