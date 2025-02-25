function unpackJS(p, a, c, k, e, d) {
  e = function (c) {
    return (
      (c < a ? '' : e(parseInt(c / a))) +
      ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    )
  }
  if (!''.replace(/^/, String)) {
    while (c--) {
      d[e(c)] = k[c] || e(c)
    }
    k = [
      function (e) {
        return d[e]
      }
    ]
    e = function () {
      return '\\w+'
    }
    c = 1
  }
  while (c--) {
    if (k[c]) {
      p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
    }
  }
  return p
}

export default function rageParse(str) {
  const pos = str.indexOf('return p}')
  let res = '[' + str.slice(pos + 9 + 1, str.length - 2) + ']'

  let ix1 = res.lastIndexOf(";'") + 2
  const a1 = res.slice(1, ix1)

  let tempString = res.slice(ix1 + 1)
  let ix2 = tempString.indexOf(',') + ix1 + 1
  const a2 = res.slice(ix1 + 1, ix2)

  tempString = res.slice(ix2 + 1)
  let ix3 = tempString.indexOf(',') + ix2 + 1
  const a3 = res.slice(ix2 + 1, ix3)

  tempString = res.slice(ix3 + 1)
  tempString = tempString.slice(1, tempString.lastIndexOf(".split('|')") - 1)
  const a4 = tempString.split('|')

  tempString = res.slice(res.indexOf(".split('|'),") + 12)
  const a5 = tempString.slice(0, tempString.indexOf(','))

  const a6 = {}

  const url = unpackJS(a1, a2, a3, a4, a5, a6)
  return url
}
