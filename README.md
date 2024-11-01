# zenshin. <img src="https://github.com/user-attachments/assets/87dd28e0-8c0a-43ce-a953-f58c604ccf62" width="23">

<p align="center" >
  <img src="https://github.com/user-attachments/assets/af797fd4-e7ca-428f-82fc-c50d13b9407c" width="120">
</p>
<p align="center">
  <a href="https://github.com/hitarth-gg/zenshin/releases/tag/v2.1.0">
    <img src="https://img.shields.io/github/downloads/hitarth-gg/zenshin/total?style=flat-square&color=blue" width="90">
  </a>
</p>

<p align="center" >
    <img src="https://github.com/user-attachments/assets/c0dbeb01-36a8-432e-95c5-e643694901c7">
</p>



A web and electron based anime torrent streamer which can stream torrents and scraped anime episodes within the app or on an external media player (like VLC or MPV).

## Electron Port (Beta) :
![image](https://github.com/user-attachments/assets/02158f0e-e2dd-4269-8ab9-d7ec57d5af6f)
![image](https://github.com/user-attachments/assets/18fffde2-676d-44e8-9137-0e5e04ed000e)
![image](https://github.com/user-attachments/assets/92fdd304-a916-4bfd-a1fa-577800a3ed3e)
![image](https://github.com/user-attachments/assets/47a662ad-0983-43a9-95bd-7bee26acce4d)
![image](https://github.com/user-attachments/assets/783330e9-1a84-49e5-a2a7-befc674d571d)
![image](https://github.com/user-attachments/assets/b8c61b0f-08b2-4005-a073-f0200a9c8842)
![image](https://github.com/user-attachments/assets/6c17a60c-34ed-44c8-b8d4-7e886ea2c496)


## Demo : (Click the image)
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/Mdh2HuqTFyQ/0.jpg)](https://youtu.be/Mdh2HuqTFyQ)

---
Note: The video player in the browser currently does not support subtitle rendering as extracting embedded subtitles from an mkv file is quite tricky and is way out of my league. To play the video with subtitles open it in VLC by clicking on the `Open VLC` button when playing an episode.

---

### Disclaimer : [disclaimer.md](https://github.com/hitarth-gg/zenshin/blob/af8cd6485cc9fa8ea59434312d022fce223daa28/disclaimer.md)

---

### Building the Electron App

Commands required to build the app on Windows, Linux and macOS (untested) are `npm run build:win`, `npm run build:linux` and `npm run build:mac` respectively.
| Windows             | Linux                 | MacOS               |
|---------------------|-----------------------|---------------------|
| `npm run build:win` | `npm run build:linux` | `npm run build:mac` |


1. Navigate to `Electron\zenshin-electron`.
2. Run `npm i` or `npm install`
3. Run `npm run build:win`
4. Check the `dist` folder (`Electron\zenshin-electron\dist`), `zenshin-electron-x.x.x-setup.exe` is the setup and the folder `win-unpacked` contains pre-installed / unpacked files.
5. `Zenshin.exe` inside the `win-unpacked` folder (`dist\win-unpacked\Zenshin.exe`) can be used if you want to avoid installing the setup.
6. Example : [YouTube: Building on Ubuntu](https://youtu.be/l13ogKtMbt0). Same process can be followed for other Operating Systems with their respective build commands.

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/l13ogKtMbt0/0.jpg)](https://youtu.be/l13ogKtMbt0)



### How to use / build (WebApp): (outdated)
- Web Version is no longer being worked on upon. Use electron.

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/DiVczJ92sAU/0.jpg)](https://www.youtube.com/watch?v=DiVczJ92sAU)

[YouTube: How to use / build](https://youtu.be/DiVczJ92sAU?si=NvqnDvXE_LW7EHW8)

---
#### VLC Media Player Support (in web version)
Define the path to vlc.exe in BACKEND/server.js : 
```js
  const vlcPath = '"C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe"'; // Adjust this path as needed
```
---

### Tech Stack and dependencies used :
- ReactJS
- ElectronJS
- WebTorrent
- TanStack React Query
- Radix UI and Radix Icons
- Video.js
- axios
- date-fns
- ldrs
- react-infinite-scroll-component
- TailwindCSS w/ tailwindcss-animated and line-clamp
- ExpressJS
- React Lenis
- Sonner
- Plyr
- Puppeteer

Inspired by Miru :)
