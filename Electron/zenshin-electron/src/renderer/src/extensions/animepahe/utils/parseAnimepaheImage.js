// http://localhost:64621/animepahe/image/snapshot/f301ead4c2b8c5f5396b32a05bded7177de19d585b6eddf74d80dfdd8dfb8723.jpg
// https://i.animepahe.ru/snapshots/f301ead4c2b8c5f5396b32a05bded7177de19d585b6eddf74d80dfdd8dfb8723.jpg

// poster
// https://i.animepahe.ru/poster/f301ead4c2b8c5f5396b32a05bded7177de19d585b6eddf74d80dfdd8dfb8723.jpg
// http://localhost:64621/animepahe/image/poster/f301ead4c2b8c5f5396b32a05bded7177de19d585b6eddf74d80dfdd8dfb8723.jpg
const BASE_URL = 'http://localhost:64621/animepahe'

// convert the image URL to the localhost animepahe image URL
export const parseAnimepaheImage = (url) => {
  // if the url is a poster image
  if (url.includes('poster')) {
    const id = url.split('/').pop()
    return `${BASE_URL}/image/poster/${id}`
  }

  // if the url is a snapshot image
  if (url.includes('snapshot')) {
    const id = url.split('/').pop()
    return `${BASE_URL}/image/snapshot/${id}`
  }
}
