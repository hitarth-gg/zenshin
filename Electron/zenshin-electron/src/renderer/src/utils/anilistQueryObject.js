export const anilistQueryObject = `
id,
idMal,
title {
  romaji,
  english,
  native,
  userPreferred
},
description(asHtml: false),
season,
seasonYear,
format,
status,
episodes,
duration,
averageScore,
popularity,
genres,
isFavourite,
coverImage {
  extraLarge,
  medium,
  color
},
source,
countryOfOrigin,
isAdult,
bannerImage,
synonyms,
nextAiringEpisode {
  timeUntilAiring,
  episode
},
startDate {
  year,
  month,
  day
},
trailer {
  id,
  site
},
streamingEpisodes {
  title,
  thumbnail
},
mediaListEntry {
  id,
  progress,
  repeat,
  status,
  customLists(asArray: true),
  score(format: POINT_10)
},
studios(isMain: true) {
  nodes {
    name
  }
},
airingSchedule(page: 1, perPage: 1, notYetAired: true) {
  nodes {
    episode,
    airingAt
  }
},
relations {
  edges {
    relationType(version:2),
    node {
      id,
      title {userPreferred},
      coverImage {medium},
      type,
      status,
      format,
      episodes,
      synonyms,
      season,
      seasonYear,
      startDate {
        year,
        month,
        day
      },
      endDate {
        year,
        month,
        day
      }
    }
  }
}`

/* ------------------------------------------------------ */

const query = `type: ANIME, search: $search, sort: $sort, onList: $onList, status: $status, status_not: $status_not, season: $season, seasonYear: $year, genre: $genre, format: $format, format_not: MUSIC`

export const getParsedAnilistQuery = (variables) => {
  let queryStr = `type: ANIME`

  for (const key in variables) {
    // generate the query string
    if (variables[key] && variables[key] && key !== 'watchStatus' && key !== 'userId') {
      queryStr += `, ${key}: ${variables[key]}`
    }
  }

  return queryStr
}

