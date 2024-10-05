const url = 'https://raw.githubusercontent.com/Fribb/anime-lists/refs/heads/master/anime-list-full.json' // Replace with the actual URL to your raw JSON file

// Fetch the JSON file from GitHub
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText)
    }
    return response.json()
  })
  .then((data) => {
    console.log('Mapping Data:', data) // Data now contains the mappings from AniDB to AniList IDs

    // Example: Access a specific mapping
    const anidbId = 123 // Replace with the actual AniDB ID you want to convert
    const anilistId = data[anidbId] // Assuming the JSON is in the format { "anidbId": "anilistId", ... }

    console.log(`AniList ID for AniDB ID ${anidbId}:`, anilistId)
  })
  .catch((error) => {
    console.error('There has been a problem with your fetch operation:', error)
  })
