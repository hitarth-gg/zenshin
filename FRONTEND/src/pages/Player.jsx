import axios from "axios";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import VideoJS from "./VideoJs";
import videojs from "video.js";
import StreamStats from "../components/StreamStats";
import { Button } from "@radix-ui/themes";
import { toast } from "sonner";
import {
  ExclamationTriangleIcon,
  LightningBoltIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import EpisodesPlayer from "../components/EpisodesPlayer";
import StreamStatsEpisode from "../components/StreamStatsEpisode";

export default function Player(query) {
  const magnetURI = useParams().magnetId;
  const [videoSrc, setVideoSrc] = useState("");
  const [subtitleSrc, setSubtitleSrc] = useState("");
  const [files, setFiles] = useState([]);
  // console.log(magnetURI);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Add the torrent
      const response = await axios.get(
        `http://localhost:8000/add/${encodeURIComponent(magnetURI)}`,
      );
      console.log(response);
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

      toast.error("Error streaming video", {
        duration: 5000,
        icon: (
          <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />
        ),
        description:
          "Couldn't stream the video, make sure the torrent is valid and the Backend Server is running.",
        classNames: {
          title: "text-rose-500",
        },
      });
    }
  };

  const getFiles = async () => {
    try {
      console.log("Inside getFiles");
      const response = await axios.get(
        `http://localhost:8000/metadata/${encodeURIComponent(magnetURI)}`,
      );
      console.log("magnetURI: " + magnetURI);

      console.log(response);
      const data = await response.data;
      setFiles(data);
      console.log("files: " + data);
    } catch (error) {
      toast.error("Backend is not running on your local machine", {
        icon: (
          <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />
        ),
        description:
          "Backend is not running on your local machine or NO files were found in the torrent",
        classNames: {
          title: "text-rose-500",
        },
      });

      console.error("Error getting torrent details", error);
    }
  };

  const handleVlcStream = async () => {
    try {
      await axios.get(
        `http://localhost:8000/add/${encodeURIComponent(magnetURI)}`,
      );

      // Send a request to the server to open VLC with the video stream URL
      await axios.get(
        `http://localhost:8000/stream-to-vlc?url=${encodeURIComponent(
          `http://localhost:8000/stream/${encodeURIComponent(magnetURI)}`,
        )}`,
      );
    } catch (error) {
      console.error("Error streaming to VLC", error);
      toast.error("Error streaming to VLC", {
        icon: (
          <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />
        ),
        description:
          "Make sure that VLC is installed on your system and correct path is set to it in BACKEND/server.js and the Backend Server is running.",
        classNames: {
          title: "text-rose-500",
        },
      });
    }
  };

  const checkBackendRunning = async () => {
    try {
      const response = await axios.get("http://localhost:8000/ping");
      console.log(response);

      if (response.status === 200) {
        toast.success("Backend is running", {
          icon: <LightningBoltIcon height="16" width="16" color="#ffffff" />,
          description: "Backend is running on your local machine",
          classNames: {
            title: "text-green-500",
          },
        });
      }
    } catch (error) {
      toast.error("Backend is not running", {
        icon: (
          <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />
        ),
        description: "Backend is not running on your local machine",
        classNames: {
          title: "text-rose-500",
        },
      });

      console.error("Error checking if the backend is running", error);
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
  const [isActive, setIsActive] = useState(false);

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

  /* ---------------- Handling batch files ---------------- */

  const handleStreamBrowser = (eipsode) => {
    setVideoSrc(
      `http://localhost:8000/streamfile/${encodeURIComponent(magnetURI)}/${encodeURIComponent(eipsode)}`,
    );
  };

  const handleStreamVlc = async (episode) => {
    try {
      // Send a request to the server to open VLC with the video stream URL
      await axios.get(
        `http://localhost:8000/stream-to-vlc?url=${encodeURIComponent(
          `http://localhost:8000/streamfile/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`,
        )}`,
      );
    } catch (error) {
      console.error("Error streaming to VLC", error);
      toast.error("Error streaming to VLC", {
        icon: (
          <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />
        ),
        description:
          "Make sure that VLC is installed on your system and correct path is set to it in BACKEND/server.js and the Backend Server is running.",
        classNames: {
          title: "text-rose-500",
        },
      });
    }
  };

  const stopEpisodeDownload = async (episode) => {
    try {
      // Send a DELETE request to remove the torrent
      console.log(`http://localhost:8000/deselect/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`);
      
      await axios.get(
        `http://localhost:8000/deselect/${encodeURIComponent(magnetURI)}/${encodeURIComponent(episode)}`,
      );

      // Clear the video and subtitle sources
      setVideoSrc("");
      setSubtitleSrc("");

      // Dispose of the player if it's active
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }

      toast.success("Torrent removed successfully", {
        icon: <TrashIcon height="16" width="16" color="#ffffff" />,
        description: "Episode download stopped successfully",
        classNames: {
          title: "text-green-500",
        },
      });
    } catch (error) {
      console.error("Couldn't stop episode download", error);

      toast.error("Couldn't stop episode download", {
        icon: (
          <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />
        ),
        description:
          "You can manually stop it by restarting the server or by removing the torrent completely.",
        classNames: {
          title: "text-rose-500",
        },
      });
    }
  };

  /* ------------------------------------------------------ */
  const handleRemoveTorrent = async () => {
    try {
      // Send a DELETE request to remove the torrent
      await axios.delete(
        `http://localhost:8000/remove/${encodeURIComponent(magnetURI)}`,
      );

      // Clear the video and subtitle sources
      setVideoSrc("");
      setCurrentEpisode("");
      setSubtitleSrc("");
      setFiles([]);

      // Dispose of the player if it's active
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }

      toast.success("Torrent removed successfully", {
        icon: <TrashIcon height="16" width="16" color="#ffffff" />,
        description: "The torrent has been removed successfully",
        classNames: {
          title: "text-green-500",
        },
      });
    } catch (error) {
      console.error("Error removing the torrent", error);

      toast.error("Error removing the torrent", {
        icon: (
          <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />
        ),
        description:
          "Couldn't remove the torrent, you can manually remove it by restarting the server.",
        classNames: {
          title: "text-rose-500",
        },
      });
    }
  };

  const [currentEpisode, setCurrentEpisode] = useState("");

  return (
    <div className="flex items-center justify-center font-space-mono">
      <div className="">
        {videoSrc && (
          <div className="flex justify-center">
            <VideoJS options={videoPlayerOptions} onReady={handlePlayerReady} />
          </div>
        )}

        {/* We basiically do this to prevent video player re-render */}
        {currentEpisode && (
          <StreamStatsEpisode
            magnetURI={magnetURI}
            episode={currentEpisode}
            stopEpisodeDownload={stopEpisodeDownload}
            setCurrentEpisode={setCurrentEpisode}
            currentEpisode={currentEpisode}
            handleStreamVlc={handleStreamVlc}
          />
        )}

        <div className="fixed-width border border-gray-700 bg-[#1d1d20] p-4">
          <StreamStats magnetURI={magnetURI} />

          <div className="mt-5 flex gap-x-3">
            <Button
              onClick={getFiles}
              size="1"
              color="blue"
              variant="soft"
              type="submit"
            >
              Get Files
            </Button>
            <Button
              size="1"
              color="red"
              variant="soft"
              onClick={handleRemoveTorrent}
            >
              Stop and Remove Anime
            </Button>
            <Button
              size="1"
              color="green"
              variant="soft"
              onClick={checkBackendRunning}
            >
              Ping Backend
            </Button>
          </div>
        </div>
        {files && (
          <div className="mt-8">
            {files.map((file) => (
              <EpisodesPlayer
                file={file}
                handleStreamBrowser={handleStreamBrowser}
                handleStreamVlc={handleStreamVlc}
                stopEpisodeDownload={stopEpisodeDownload}
                setCurrentEpisode={setCurrentEpisode}
              />
            ))}{" "}
          </div>
        )}
      </div>
    </div>
  );
}
