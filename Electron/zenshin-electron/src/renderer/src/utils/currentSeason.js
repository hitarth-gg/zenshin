export function getCurrentSeason() {
  const date = new Date()
  const currentSeason = ['WINTER', 'SPRING', 'SUMMER', 'FALL'][
    Math.floor((date.getMonth() / 12) * 4) % 4
  ]
  return currentSeason
}
