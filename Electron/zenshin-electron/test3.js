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

const res = `(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('j q=\'1N://1M-13.1L.1K/1J/13/1I/1H/1G.1F\';j g=u.t(\'g\');j 3=D 1E(g,{\'1D\':{\'1C\':k},\'1B\':\'16:9\',\'G\':1,\'1A\':5,\'1z\':{1y:1,1x:[0.1w,1,1.1,1.15,1.2,1.1v,1.5,2,4]},\'1u\':{\'1t\':\'1s\'},\'1r\':[\'a-1q\',\'a\',\'1p\',\'1o-1n\',\'1m\',\'1l-1k\',\'1j\',\'G\',\'1i\',\'1h\',\'1g\',\'1f\',\'F\',\'1e\'],\'F\':{\'1d\':k}});b(!C.1c()){g.1b=q}z{l B={1a:19,18:17*E*E,14:12,11:10,Z:9,Y:k,X:k};j f=D C(B);f.W(q);f.V(g);i.f=f}3.6("U",8=>{i.T.S.R("Q")});m x(d,p,o){b(d.A){d.A(p,o,P)}z b(d.y){d.y(\'6\'+p,o)}}l 7=m(n){i.O.N(n,\'*\')};x(i,\'n\',m(e){l c=e.c;b(c===\'a\')3.a();b(c===\'h\')3.h();b(c===\'w\')3.w()});3.6(\'v\',8=>{7(\'v\')});3.6(\'a\',8=>{7(\'a\')});3.6(\'h\',8=>{7(\'h\')});3.6(\'M\',8=>{7(3.s);u.t(\'.L-K\').J=I(3.s.H(2))});3.6(\'r\',8=>{7(\'r\')});',62,112,'|||player|||on|sendMessage|event||play|if|data|element||hls|video|pause|window|const|true|var|function|message|eventHandler|eventName|source|ended|currentTime|querySelector|document|ready|stop|bindEvent|attachEvent|else|addEventListener|config|Hls|new|1000|fullscreen|volume|toFixed|String|innerHTML|timestamp|ss|timeupdate|postMessage|parent|false|landscape|lock|orientation|screen|enterfullscreen|attachMedia|loadSource|lowLatencyMode|enableWorker|nudgeMaxRetry|600|maxMaxBufferLength|300||maxBufferLength|||120|maxBufferSize|90|backBufferLength|src|isSupported|iosNative|capture|airplay|pip|settings|captions|mute|time|current|progress|forward|fast|rewind|large|controls|kwik|key|storage|25|75|options|selected|speed|seekTime|ratio|global|keyboard|Plyr|m3u8|uwu|ad979ffc01a8691f9fe2c3068fb65b5e058c5f3afd1d90e73e8995ae56540dec|03|stream|ru|kwikie|vault|https'.split('|'),0,{}))`
const ow = rageParse(res)
console.log(ow)

const url2 =
  'const source=\'https://vault-13.kwikie.ru/stream/13/03/90da50cd358f553bae83affc4f192dc57c1d0ecedd4bccc0cc045fb4e5889587/uwu.m3u8\';const video=document.querySelector(\'video\');const player=new Plyr(video,{\'keyboard\':{\'global\':true},\'ratio\':\'16:9\',\'volume\':1,\'seekTime\':5,\'speed\':{selected:1,options:[0.75,1,1.1,1.15,1.2,1.25,1.5,2,4]},\'storage\':{\'key\':\'kwik\'},\'controls\':[\'play-large\',\'play\',\'rewind\',\'fast-forward\',\'progress\',\'current-time\',\'mute\',\'volume\',\'captions\',\'settings\',\'pip\',\'airplay\',\'fullscreen\',\'capture\'],\'fullscreen\':{\'iosNative\':true}});if(!Hls.isSupported()){video.src=source}else{var config={backBufferLength:90,maxBufferSize:120*1000*1000,maxBufferLength:300,maxMaxBufferLength:600,nudgeMaxRetry:9,enableWorker:true,lowLatencyMode:true};const hls=new Hls(config);hls.loadSource(source);hls.attachMedia(video);window.hls=hls}player.on("enterfullscreen",event=>{window.screen.orientation.lock("landscape")});function bindEvent(element,eventName,eventHandler){if(element.addEventListener){element.addEventListener(eventName,eventHandler,false)}else if(element.attachEvent){element.attachEvent(\'on\'+eventName,eventHandler)}}var sendMessage=function(message){window.parent.postMessage(message,\'*\')};bindEvent(window,\'message\',function(e){var data=e.data;if(data===\'play\')player.play();if(data===\'pause\')player.pause();if(data===\'stop\')player.stop()});player.on(\'ready\',event=>{sendMessage(\'ready\')});player.on(\'play\',event=>{sendMessage(\'play\')});player.on(\'pause\',event=>{sendMessage(\'pause\')});player.on(\'timeupdate\',event=>{sendMessage(player.currentTime);document.querySelector(\'.ss-timestamp\').innerHTML=String(player.currentTime.toFixed(2))});player.on(\'ended\',event=>{sendMessage(\'ended\')});'

const urlMatch = .match(/source='(.+?)'/)
if (urlMatch && urlMatch[1]) {
  console.log(urlMatch[1])
} else {
  console.warn('No URL found in decoded script:')
}
const
t =
