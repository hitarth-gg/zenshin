import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Player(query) {
  const magnetURI = useParams().magnetId;
  const [videoSrc, setVideoSrc] = useState("");
  console.log(magnetURI);

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
    } catch (error) {
      console.error("Error adding the torrent or streaming video", error);
    }
  };


  return (
    <div>
      <div className="App">
        {/* <h1>Torrent Streamer</h1> */}
        <form onSubmit={handleSubmit}>
          <button type="submit">Stream</button>
        </form>
        {videoSrc && (
          <video controls src={videoSrc} style={{ width: "100%" }} />
        )}
      </div>
    </div>
  );
}
