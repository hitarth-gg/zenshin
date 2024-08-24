const str = `"<strong>Source(s)</strong>: <a href="https://www.tokyotosho.info/details.php?id=1904769">TokyoTosho</a> | <a href="https://nyaa.si/view/1863631" title="Nyaa: Trusted"><span style="color: #6cac7e;">&#9679;</span>Nyaa</a><br/><strong>Total Size</strong>: 934.1 MB<br/><strong>Download Links</strong>: <a href="https://mirror.animetosho.org/storage/torrent/a76c8c6e495a78960b913ad4aa1b3d67df4b9413/%5BSubsPlease%5D%202.5-jigen%20no%20Ririsa%20-%2008%20%281080p%29%20%5B255E1372%5D.torrent">Torrent</a>/

<a href="magnet:?xt=urn:btih:U5WIY3SJLJ4JMC4RHLKKUGZ5M7PUXFAT&amp;tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&amp;tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce&amp;tr=udp%3A%2F%2F9.rarbg.me%3A2710%2Fannounce&amp;dn=%5BSubsPlease%5D%202.5-jigen%20no%20Ririsa%20-%2008%20%281080p%29%20%5B255E1372%5D.mkv">Magnet</a>

, <a href="https://mirror.animetosho.org/storage/nzbs/0009d4e5/%5BSubsPlease%5D%202.5-jigen%20no%20Ririsa%20-%2008%20%281080p%29%20%5B255E1372%5D.nzb.gz">NZB</a> | <a href="https://buzzheavier.com/f/GVrA9Mtf0AA">BuzzHeavier</a> | <a href="https://dailyuploads.net/tfntmbx36ccg">DailyUploads</a> | <a href="https://gofile.io/d/3NGq0A">GoFile</a> | <a href="https://krakenfiles.com/view/Tzd5UfTqdU/file.html">KrakenFiles</a> | <a href="https://down.mdiaload.com/uxn437avdpyj">MdiaLoad</a><br/>MultiUp: <a href="https://multiup.io/download/4e65eb53edbb6ffc09b43122f7f41c63/%5BSubsPlease%5D%202.5-jigen%20no%20Ririsa%20-%2008%20%281080p%29%20%5B255E1372%5D.mkv.001">Part1</a>, <a href="https://multiup.io/download/df1760555bfeb73ad5b42dbbb89a800e/%5BSubsPlease%5D%202.5-jigen%20no%20Ririsa%20-%2008%20%281080p%29%20%5B255E1372%5D.mkv.002">Part2</a>"`;

const magnetRegex = /<a href="([^"]*)">Magnet<\/a>/i;
let magnetRegex2 = /<a href="(magnet:[^"]*)">Magnet<\/a>/i;
const match1 = magnet.match(magnetRegex);
const match2 = match1[0].match(magnetRegex2);
const match3 = match2[0]?.split('"')[1];

console.log(match3);
