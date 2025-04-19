let BASE_URL = 'http://localhost:64621/animepahe'

async function backendPort() {
  const response = await window.api.getSettingsJson()
  const backendPort = response.backendPort
  BASE_URL = `http://localhost:${backendPort}/animepahe`
}

backendPort()

export const animepaheLatest = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/latest?page=${page}`)
  return response.json()
}
export const animepaheDetails = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/details?id=${page}`)
  return response.json()
}

export const animepaheEpisodes = async (id, page = 1) => {
  const response = await fetch(`${BASE_URL}/getallepisodes?id=${id}`)
  const data = await response.json()
  return { data: data.episodes }
}
export const animepaheEpisodesOfPage = async (id, page = 1) => {
  const response = await fetch(`${BASE_URL}/getepisodesofpage?id=${id}&page=${page}`)
  const data = await response.json()
  return { data: data.episodes }
}

export const animepahePlay = async (id, episode) => {
  const response = await fetch(`${BASE_URL}/play?id=${id}&episode=${episode}`)
  return response.json()
}

export const animepaheSearch = async (query) => {
  const response = await fetch(`${BASE_URL}/search?q=${query}`)
  return response.json()
}
