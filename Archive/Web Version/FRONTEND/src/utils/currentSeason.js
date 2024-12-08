export function getCurrentSeason() {
  const month = new Date().getMonth() + 1 // getMonth() returns 0-11, so add 1

  if (month >= 3 && month <= 5) {
    return 'SPRING'
  } else if (month >= 6 && month <= 9) {
    return 'SUMMER'
  } else if (month >= 9 && month <= 11) {
    return 'FALL'
  } else {
    return 'WINTER'
  }
}
