const a = ['mpv', 'vlc', 'pot']
const path = "downloads/mpv.exe"
if (a.map((item) => path.includes(item)).includes(true)) {
  console.log('available')
}
