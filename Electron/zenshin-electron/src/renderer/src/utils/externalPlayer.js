export function cleanPath(path) {
  return path.replace(/^"(.*)"$/, '$1')
}

export function validateStreamUrl(url) {
  try {
    const parsed = new URL(url)

    // only allow HTTP
    if (parsed.protocol !== 'http:') return false

    // only allow localhost
    if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
      return false
    }

    // cuz the backend serves the stream at /streamfile/:magnet/:episode
    if (!parsed.pathname.startsWith('/streamfile/')) {
      return false
    }

    return true
  } catch {
    return false
  }
}
