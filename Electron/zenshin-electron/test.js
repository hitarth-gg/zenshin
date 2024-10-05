// Array of anime IDs
const ids = [100, 101, 102] // Replace with actual anime IDs you want to fetch

// Dynamically construct the GraphQL query
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

// Fetch request to the AniList GraphQL API
fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  body: JSON.stringify({ query })
})
  .then((response) => response.json())
  .then((data) => {
    if (data.errors) {
      console.error('Errors:', data.errors)
    } else {
      console.log('Fetched Data:', data)
    }
  })
  .catch((error) => console.error('Error:', error))
