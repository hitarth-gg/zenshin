 const getParsedAnilistQuery = (variables) => {
  let queryStr = `type: ANIME`

  for (const key in variables) {
    // generate the query string
    if (variables[key] && variables[key] && key !== 'userId') {
      console.log('key: ', key);

      queryStr += `, ${key}: ${variables[key]}`
    }
  }

  return queryStr
}

const a = getParsedAnilistQuery({
  type: 'ANIME',
  search: 'search',
  userId: 123
})

console.log(a)
