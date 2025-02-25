const code = `eval(
  (function (p, a, c, k, e, d) {
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
  })(
    'f $7={H:a(2){4 B(9.7.h(y z("(?:(?:^|.*;)\\\\s*"+d(2).h(/[\\-\\.\\+\\*]/g,"\\\\$&")+"\\\\s*\\\\=\\\\s*([^;]*).*$)|^.*$"),"$1"))||G},E:a(2,q,3,6,5,t){k(!2||/^(?:8|r\\-v|o|m|p)$/i.D(2)){4 w}f b="";k(3){F(3.J){j K:b=3===P?"; 8=O, I N Q M:u:u A":"; r-v="+3;n;j L:b="; 8="+3;n;j S:b="; 8="+3.Z();n}}9.7=d(2)+"="+d(q)+b+(5?"; m="+5:"")+(6?"; o="+6:"")+(t?"; p":"");4 x},Y:a(2,6,5){k(!2||!11.C(2)){4 w}9.7=d(2)+"=; 8=12, R 10 W l:l:l A"+(5?"; m="+5:"")+(6?"; o="+6:"");4 x},C:a(2){4(y z("(?:^|;\\\\s*)"+d(2).h(/[\\-\\.\\+\\*]/g,"\\\\$&")+"\\\\s*\\\\=")).D(9.7)},X:a(){f c=9.7.h(/((?:^|\\s*;)[^\\=]+)(?=;|$)|^\\s*|\\s*(?:\\=[^;]*)?(?:\\1|$)/g,"").T(/\\s*(?:\\=[^;]*)?;\\s*/);U(f e=0;e<c.V;e++){c[e]=B(c[e])}4 c}};',
    62,
    65,
    '||sKey|vEnd|return|sDomain|sPath|cookie|expires|document|function|sExpires|aKeys|encodeURIComponent|nIdx|var||replace||case|if|00|domain|break|path|secure|sValue|max||bSecure|59|age|false|true|new|RegExp|GMT|decodeURIComponent|hasItem|test|setItem|switch|null|getItem|31|constructor|Number|String|23|Dec|Fri|Infinity|9999|01|Date|split|for|length|1970|keys|removeItem|toUTCString|Jan|this|Thu'.split(
      '|'
    ),
    0,
    {}
  )
)`

function unPack (code) {
	function indent (code) {
		try {
		var tabs = 0, old=-1, add='';
		for(var i=0;i<code.length;i++) {
			if(code[i].indexOf("{") != -1) tabs++;
			if(code[i].indexOf("}") != -1) tabs--;

			if(old != tabs) {
				old = tabs;
				add = "";
				while (old > 0) {
					add += "\t";
					old--;
				}
				old = tabs;
			}

			code[i] = add + code[i];
		}
		} finally {
			tabs = null;
			old = null;
			add = null;
		}
		return code;
	}

    var env = {
        eval: function (c) {
            code = c;
        },
        window: {},
        document: {}
    };

    eval("with(env) {" + code + "}");

	code = (code+"").replace(/;/g, ";\n").replace(/{/g, "\n{\n").replace(/}/g, "\n}\n").replace(/\n;\n/g, ";\n").replace(/\n\n/g, "\n");

    code = code.split("\n");
    code = indent(code);

    code = code.join("\n");
    return code;
}

const match = code.match(/source\s*=\s*['"]([^'"]+)['"]/)
console.log(match) // Extracted URL
