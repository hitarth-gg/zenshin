const BASE_URL = 'http://localhost:64621/animepahe'

// http://localhost:64621/animepahe/latest?page=2
//
export const animepaheLatest = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/latest?page=${page}`)
  return response.json()
}


