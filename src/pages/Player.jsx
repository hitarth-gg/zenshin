// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function Player(query) {
//   const magnetURI = useParams().magnetId;
//   const [videoSrc, setVideoSrc] = useState("");
//   const [subtitleSrc, setSubtitleSrc] = useState("");
//   console.log(magnetURI);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Step 1: Add the torrent
//       await axios.get(
//         `http://localhost:8000/add/${encodeURIComponent(magnetURI)}`,
//       );
//       // Step 2: Set the video source for streaming
//       setVideoSrc(
//         `http://localhost:8000/stream/${encodeURIComponent(magnetURI)}`,
//       );
//       // Step 3: Set the subtitle source
//       setSubtitleSrc(
//         `http://localhost:8000/subtitles/${encodeURIComponent(magnetURI)}`,
//       );
//     } catch (error) {
//       console.error("Error adding the torrent or streaming video", error);
//     }
//   };

//   console.log(videoSrc, subtitleSrc);

//   return (
//     <div>
//       <div className="App">
//         <form onSubmit={handleSubmit}>
//           <button type="submit">Stream</button>
//         </form>
//         {videoSrc && (
//           <video controls src={videoSrc} style={{ width: "70%" }}>
//             {subtitleSrc && (
//               <track
//                 kind="subtitles"
//                 src={subtitleSrc}
//                 srcLang="en"
//                 label="English"
//                 default
//               />
//             )}
//           </video>
//         )}
//       </div>
//     </div>
//   );
// }
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import VideoJS from "./VideoJs";
import videojs from "video.js";
import StreamStats from "../components/StreamStats";

export default function Player(query) {
  const magnetURI = useParams().magnetId;
  const [videoSrc, setVideoSrc] = useState("");
  const [subtitleSrc, setSubtitleSrc] = useState("");
  // console.log(magnetURI);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Add the torrent
      await axios.get(
        `http://localhost:8000/add/${encodeURIComponent(magnetURI)}`,
      );
      // Step 2: Set the video source for streaming
      setVideoSrc(
        `http://localhost:8000/stream/${encodeURIComponent(magnetURI)}`,
      );
      // Step 3: Set the subtitle source
      setSubtitleSrc(
        `http://localhost:8000/subtitles/${encodeURIComponent(magnetURI)}`,
      );
    } catch (error) {
      console.error("Error adding the torrent or streaming video", error);
    }
  };

  /* ------------------------------------------------------ */

  const videoPlayerOptions = {
    autoplay: true,
    controls: true,
    // fluid: true,
    // preload: "auto",
    height: 480,
    width: 854,
    textTrackSettings: true,
    sources: [
      {
        src: videoSrc,
        type: "video/webm",
      },
    ],
    tracks: [
      { src: subtitleSrc, kind: "captions", srclang: "en", label: "English" },
    ],
  };
  const playerRef = useRef(null);

  console.log(subtitleSrc);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  /* ------------------------------------------------------ */

  return (
    <div className="font-space-mono flex justify-center items-center ">
      <div className="App w-3/5 ">
        <form onSubmit={handleSubmit}>
          <button type="submit">Stream</button>
        </form>
        {videoSrc && (
          <VideoJS options={videoPlayerOptions} onReady={handlePlayerReady} />
        )}
      <StreamStats magnetURI={magnetURI} /> {/* We basiically do this to prevent video player re-render */}
      </div>
    </div>
  );
}
