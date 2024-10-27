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


A web and electron based anime torrent streamer which can stream torrents in the browser and on the VLC media player as well.

## Electron Port (Beta) :
![image](https://github.com/user-attachments/assets/2b11e7a9-9667-43b4-a95d-38b1365467f7)
![image](https://github.com/user-attachments/assets/e1114387-0432-4bf2-a692-c0e1c3f46df6)
![image](https://github.com/user-attachments/assets/30d6e6b4-f63f-4ed5-97f1-96b898a2c1d0)
![image](https://github.com/user-attachments/assets/d9906902-0756-4d16-ad20-77fcadcb5d82)
![image](https://github.com/user-attachments/assets/0d5720ff-c06e-452d-b0cd-c2078ba3f115)
![image](https://github.com/user-attachments/assets/01939941-c2d4-4d2d-8596-36cbdab82f86)
![image](https://github.com/user-attachments/assets/8e0588c3-e44e-49a3-bea8-55dbe27f4f8f)
![image](https://github.com/user-attachments/assets/a3662bff-c799-45ec-a77d-2b11ff313465)
![image](https://github.com/user-attachments/assets/844af4d5-9dbb-41a3-b6de-7ee0d5016440)
![image](https://github.com/user-attachments/assets/f2190575-a983-40d8-9a32-41e34d0a1fc2)

## Demo : (Click the image)
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/Mdh2HuqTFyQ/0.jpg)](https://youtu.be/Mdh2HuqTFyQ)


## Summary
Built it as a mini project to familiarize myself with video streaming using ExpressJS and handling of streams and APIs in a ReactJS based frontend webapp.

---

Note: The video player in the browser currently does not support subtitle rendering as extracting embedded subtitles from an mkv file is quite tricky and is way out of my league. To play the video with subtitles open it in VLC by clicking on the `Open VLC` button when playing an episode.

### VLC Media Player Support
Define the path to vlc.exe in BACKEND/server.js : 

```js
  const vlcPath = '"C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe"'; // Adjust this path as needed
```

---

### Disclaimer

This website is a personal project created for educational purposes only, intended as a tool to learn and explore web development technologies. We do not own, host, or store any of the content available through this platform, including any anime torrents. All torrents accessible through this site are sourced from third-party websites and are not under our control.

We do not endorse or condone piracy or the unauthorized distribution of copyrighted content. Users are responsible for ensuring that their actions comply with local laws and regulations. By using this website, you acknowledge that this project is purely for educational exploration, and any use of the content provided is at your own discretion and risk.

The core aim of this project is to co-relate automation and efficiency to extract what is provided to a user on the internet. All content available through the project is hosted by external non-affiliated sources.

Any content served through this project is publicly accessible. If your site is listed in this project, the code is pretty much public. Take necessary measures to counter the exploits used to extract content in your site.
Think of this project as a normal browser or a simple webscraper, but a bit more straight-forward and specific.

If you are a content owner and believe that your rights are being violated, please contact the relevant third-party sources directly.

---

### Building the Electron App
1. Navigate to `Electron\zenshin-electron`.
2. Run `npm i` or `npm install`
3. Run `npm run build:win`
4. Check the `dist` folder (`Electron\zenshin-electron\dist`), `zenshin-electron-x.x.x-setup.exe` is the setup and the folder `win-unpacked` contains pre-installed / unpacked files.
5. `Zenshin.exe` inside the `win-unpacked` folder (`dist\win-unpacked\Zenshin.exe`) can be used if you want to avoid installing the setup. 

### How to use / build (WebApp): (outdated)
- Web Version is no longer being worked on upon. Use electron.
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/DiVczJ92sAU/0.jpg)](https://www.youtube.com/watch?v=DiVczJ92sAU)

[YouTube: How to use / build](https://youtu.be/DiVczJ92sAU?si=NvqnDvXE_LW7EHW8)

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
- 

Inspired by Miru :)
