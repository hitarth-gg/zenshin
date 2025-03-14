const encUrls = {
  tosho: decodeURIComponent(atob('aHR0cHM6Ly9mZWVkLmFuaW1ldG9zaG8ub3Jn')),
  pahe: decodeURIComponent(atob('aHR0cHM6Ly9hbmltZXBhaGUucnU=')),
  paheimages: decodeURIComponent(atob('aHR0cHM6Ly9pLmFuaW1lcGFoZS5ydQ==')),
  zenshinSupabase: decodeURIComponent(
    atob('aHR0cDovL3plbnNoaW4tc3VwYWJhc2UtYXBpLW15aWcub25yZW5kZXIuY29t')
  ),
  nyaaApi: decodeURIComponent(atob('aHR0cHM6Ly9ueWFhYXBpLm9ucmVuZGVyLmNvbS9ueWFh'))
}

function isTruthyWithZero(value) {
  return Boolean(value) || value === 0
}

export { isTruthyWithZero }

export default encUrls
