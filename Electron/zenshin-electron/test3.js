async function getMultipleAnilistIds(ids) {
  // Fetch request to the AniList GraphQL API
  console.log('ids:', ids);

  let query = `query {`
  ids.forEach((id, index) => {
    query += `
      anime${index + 1}: Media(id: ${id}) {
        id
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
    console.log('Fetched Data:', data)
  } catch (error) {
    console.error('Error:', error)
    throw new Error(error)
  }
}

// Example usage
const ids = [176311,154963,163146,173388,173533] // Replace with actual anime IDs you want to fetch
const data = getMultipleAnilistIds(ids)
console.log(data)
