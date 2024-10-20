// http://localhost:64621/animepahe/image/f301ead4c2b8c5f5396b32a05bded7177de19d585b6eddf74d80dfdd8dfb8723.jpg
// https://i.animepahe.ru/snapshots/f301ead4c2b8c5f5396b32a05bded7177de19d585b6eddf74d80dfdd8dfb8723.jpg

const BASE_URL = 'http://localhost:64621/animepahe'

// convert the image URL to the localhost animepahe image URL
export const parseAnimepaheImage = (url) => {
  const id = url.split('/').pop()
  return `${BASE_URL}/image/${id}`
}
