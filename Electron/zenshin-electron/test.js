let str = `(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('j q=\'1N://1M-H.1L.1K/1J/H/1I/1H/1G.1F\';j g=u.t(\'g\');j 3=D 1E(g,{\'1D\':{\'1C\':k},\'1B\':\'16:9\',\'G\':1,\'1A\':5,\'1z\':{1y:1,1x:[0.1w,1,1.1,1.15,1.2,1.1v,1.5,2,4]},\'1u\':{\'1t\':\'1s\'},\'1r\':[\'a-1q\',\'a\',\'1p\',\'1o-1n\',\'1m\',\'1l-1k\',\'1j\',\'G\',\'1i\',\'1h\',\'1g\',\'1f\',\'F\',\'1e\'],\'F\':{\'1d\':k}});b(!C.1c()){g.1b=q}z{l B={1a:19,18:17*E*E,14:13,12:11,10:9,Z:k,Y:k};j f=D C(B);f.X(q);f.W(g);i.f=f}3.6("V",8=>{i.U.T.S("R")});m x(d,p,o){b(d.A){d.A(p,o,Q)}z b(d.y){d.y(\'6\'+p,o)}}l 7=m(n){i.P.O(n,\'*\')};x(i,\'n\',m(e){l c=e.c;b(c===\'a\')3.a();b(c===\'h\')3.h();b(c===\'w\')3.w()});3.6(\'v\',8=>{7(\'v\')});3.6(\'a\',8=>{7(\'a\')});3.6(\'h\',8=>{7(\'h\')});3.6(\'N\',8=>{7(3.s);u.t(\'.M-L\').K=J(3.s.I(2))});3.6(\'r\',8=>{7(\'r\')});',62,112,'|||player|||on|sendMessage|event||play|if|data|element||hls|video|pause|window|const|true|var|function|message|eventHandler|eventName|source|ended|currentTime|querySelector|document|ready|stop|bindEvent|attachEvent|else|addEventListener|config|Hls|new|1000|fullscreen|volume|99|toFixed|String|innerHTML|timestamp|ss|timeupdate|postMessage|parent|false|landscape|lock|orientation|screen|enterfullscreen|attachMedia|loadSource|lowLatencyMode|enableWorker|nudgeMaxRetry|600|maxMaxBufferLength|300|maxBufferLength|||120|maxBufferSize|90|backBufferLength|src|isSupported|iosNative|capture|airplay|pip|settings|captions|mute|time|current|progress|forward|fast|rewind|large|controls|kwik|key|storage|25|75|options|selected|speed|seekTime|ratio|global|keyboard|Plyr|m3u8|uwu|5617327c6e093c54fbf8efcaa12a91fa29c6ea89fa3812823eea040ee9e719be|02|stream|ru|kwikie|vault|https'.split('|'),0,{}))`

// const str2 = `(asd)(23)`
// remove everything between first pair of ()
const pos = str.indexOf('return p}')
let str1 = '[' + str.slice(pos + 9 + 1, str.length - 2) + ']'
// const arr = JSON.parse(str1)
// console.log(arr);

// console.log(str1)
const tt = `['j q='1N://1M-H.1L.1K/1J/H/1I/1H/1G.1F';j g=u.t('g');j 3=D 1E(g,{'1D':{'1C':k},'1B':'16:9','G':1,'1A':5,'1z':{1y:1,1x:[0.1w,1,1.1,1.15,1.2,1.1v,1.5,2,4]},'1u':{'1t':'1s'},'1r':['a-1q','a','1p','1o-1n','1m','1l-1k','1j','G','1i','1h','1g','1f','F','1e'],'F':{'1d':k}});b(!C.1c()){g.1b=q}z{l B={1a:19,18:17*E*E,14:13,12:11,10:9,Z:k,Y:k};j f=D C(B);f.X(q);f.W(g);i.f=f}3.6("V",8=>{i.U.T.S("R")});m x(d,p,o){b(d.A){d.A(p,o,Q)}z b(d.y){d.y('6'+p,o)}}l 7=m(n){i.P.O(n,'*')};x(i,'n',m(e){l c=e.c;b(c==='a')3.a();b(c==='h')3.h();b(c==='w')3.w()});3.6('v',8=>{7('v')});3.6('a',8=>{7('a')});3.6('h',8=>{7('h')});3.6('N',8=>{7(3.s);u.t('.M-L').K=J(3.s.I(2))});3.6('r',8=>{7('r')});',62,112,'|||player|||on|sendMessage|event||play|if|data|element||hls|video|pause|window|const|true|var|function|message|eventHandler|eventName|source|ended|currentTime|querySelector|document|ready|stop|bindEvent|attachEvent|else|addEventListener|config|Hls|new|1000|fullscreen|volume|99|toFixed|String|innerHTML|timestamp|ss|timeupdate|postMessage|parent|false|landscape|lock|orientation|screen|enterfullscreen|attachMedia|loadSource|lowLatencyMode|enableWorker|nudgeMaxRetry|600|maxMaxBufferLength|300|maxBufferLength|||120|maxBufferSize|90|backBufferLength|src|isSupported|iosNative|capture|airplay|pip|settings|captions|mute|time|current|progress|forward|fast|rewind|large|controls|kwik|key|storage|25|75|options|selected|speed|seekTime|ratio|global|keyboard|Plyr|m3u8|uwu|5617327c6e093c54fbf8efcaa12a91fa29c6ea89fa3812823eea040ee9e719be|02|stream|ru|kwikie|vault|https'.split('|'),0,{}]`

function ctt(p, a, c, k, e, d) {
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

let arr = []
let ix1 = tt.lastIndexOf(";'") + 2
const a1 = tt.slice(1, ix1)

let tempString = tt.slice(ix1 + 1)
let ix2 = tempString.indexOf(',') + ix1 + 1
const a2 = tt.slice(ix1 + 1, ix2)

tempString = tt.slice(ix2 + 1)
let ix3 = tempString.indexOf(',') + ix2 + 1
const a3 = tt.slice(ix2 + 1, ix3)

tempString = tt.slice(ix3 + 1)
tempString = tempString.slice(1, tempString.lastIndexOf(".split('|')") - 1)
const a4 = tempString.split('|')

tempString = tt.slice(tt.indexOf(".split('|'),") + 12)
const a5 = tempString.slice(0, tempString.indexOf(','))

const a6 = {}

// console.log(tempString)
// console.log(tt.indexOf(".split"), tt.length - 1)

// let ix = []

// for (let i = 0; i < tt.length; i++) {
//   if (
//     tt[i] === ',' &&
//     (i > 0 ? tt[i - 1] !== "'" : true) && // Prevents accessing tt[-1]
//     (i < tt.length - 1 ? tt[i + 1] !== "'" : true) // Prevents accessing tt[tt.length]
//   ) {
//     ix.push(i)
//   }
// }

// console.log(ix)
