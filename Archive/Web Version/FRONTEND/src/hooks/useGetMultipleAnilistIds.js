import { useQuery } from '@tanstack/react-query'

// // Array of anime IDs
// const ids = [100, 101, 102] // Replace with actual anime IDs you want to fetch

// // Dynamically construct the GraphQL query
// let query = `query {`

// ids.forEach((id, index) => {
//   query += `
//     anime${index + 1}: Media(id: ${id}) {
//       id
//       title {
//         romaji
//         english
//         native
//       }
//       episodes
//       streamingEpisodes {
//         title
//         thumbnail
//         url
//         site
//       }
//       description
//     }`
// })

// query += `}`

async function getMultipleAnilistIds(ids) {
  // Fetch request to the AniList GraphQL API

  console.log('ids:', ids)

  let query = `query {`
  ids.forEach((id, index) => {
    query += `
      anime${index + 1}: Media(id: ${id}) {
        id
        coverImage {
          extraLarge
          large
          medium
        }
        title {
          romaji
          english
          native
        }
        episodes
        streamingEpisodes {
          title
          thumbnail
          url
          site
        }
        description
      }`
  })

  query += `}`

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ query })
    })
    const data = await response.json()
    console.log('Fetched Data:', data);
    return data

  } catch (error) {
    console.error('Error:', error)
    throw new Error(error)
  }
}

export default function useGetMultipleAnilistIds(ids) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ['multiple_ids_anilist', ids.toString()],
    queryFn: () => {
      if (ids && ids.length > 0) return getMultipleAnilistIds(ids)
      return null
    },
    staleTime: 1000 * 60 * 5 // 5 mins
  })

  return { isLoading, data, error, status }
}
