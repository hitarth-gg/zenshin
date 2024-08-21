export function downloadLink(magnetURI) {
    return new Promise((resolve, reject) => {
      const torrent = client.add(
        magnetURI,
        {
          destroyStore: true,
          deselect: true,
        },
        (torrent) => {
          console.log("Client is downloading:", torrent.infoHash);
          // Deselect all files on initial download
          // torrent.files.forEach((file) => file.deselect());
          // torrent.deselect(0, torrent.pieces.length - 1, false);
          torrent.files.forEach(async (file) => {
            // console.log(file.name);
            if (file.name.endsWith(EXT)) {
              torrent.on("download", (bytes) => {
                logProgress(torrent, bytes);
              });
  
              torrent.on("done", () => {
                console.log("torrent download finished");
                torrent.deselect();
                resolve(torrent);
              });
  
              torrent.on("error", (err) => {
                console.log(err);
                reject(err);
              });
  
              saveLocally(file, "./downloads");
            }
          });
        }
      );
  });
  }
