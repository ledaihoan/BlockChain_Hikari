$(function () {
    sha256 = function(){function e(a, b){return a >>> b | a << 32 - b}for (var b = 1, a, m = [], n = []; 18 > ++b; )for (a = b * b; 312 > a; a += b)m[a] = 1; b = 1; for (a = 0; 313 > b; )m[++b] || (n[a] = Math.pow(b, .5) % 1 * 4294967296 | 0, m[a++] = Math.pow(b, 1 / 3) % 1 * 4294967296 | 0); return function(g){for (var l = n.slice(b = 0), c = unescape(encodeURI(g)), h = [], d = c.length, k = [], f, p; b < d; )k[b >> 2] |= (c.charCodeAt(b) & 255) << 8 * (3 - b++ % 4); d *= 8; k[d >> 5] |= 128 << 24 - d % 32; k[p = d + 64 >> 5 | 15] = d; for (b = 0; b < p; b += 16){for (c = l.slice(a = 0, 8); 64 > a; c[4] += f)h[a] = 16 > a?k[a + b]:(e(f = h[a - 2], 17) ^ e(f, 19) ^ f >>> 10) + (h[a - 7] | 0) + (e(f = h[a - 15], 7) ^ e(f, 18) ^ f >>> 3) + (h[a - 16] | 0), c.unshift((f = (c.pop() + (e(g = c[4], 6) ^ e(g, 11) ^ e(g, 25)) + ((g & c[5] ^ ~g & c[6]) + m[a]) | 0) + (h[a++] | 0)) + (e(d = c[0], 2) ^ e(d, 13) ^ e(d, 22)) + (d & c[1] ^ c[1] & c[2] ^ c[2] & d)); for (a = 8; a--; )l[a] = c[a] + l[a]}for (c = ""; 63 > a; )c += (l[++a >> 3] >> 4 * (7 - a % 8) & 15).toString(16); return c}}();
    Helper= class {
        static Captcha() {
            var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
            var i;
            for (i = 0; i < 6; i++) {
                var a = alpha[Math.floor(Math.random() * alpha.length)];
                var b = alpha[Math.floor(Math.random() * alpha.length)];
                var c = alpha[Math.floor(Math.random() * alpha.length)];
                var d = alpha[Math.floor(Math.random() * alpha.length)];
                var e = alpha[Math.floor(Math.random() * alpha.length)];
                var f = alpha[Math.floor(Math.random() * alpha.length)];
                var g = alpha[Math.floor(Math.random() * alpha.length)];
            }
            var code = a + b + c + d + e + f + g;
            return code;
        }

        static ValidCaptcha(captcha, vulCaptcha) {
            if (captcha == vulCaptcha) {
                return true;
            } else {
                return false;
            }
        }

        static RemoveSpaces(string) {
            return string.split(' ').join('');
        }

        static OnSuccess(div, message) {
            div.empty();
            div.show();
            div.html("<div class='alert alert-success alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Thành công! </strong>" + message + ".  </div>");
            div.delay(6000).hide(0);
        };

        static OnMessage(div, message) {
            div.empty();
            div.show();
            div.html("<div class='alert alert-success alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Thông báo! </strong>" + message + ".  </div>");
            div.delay(6000).hide(0);
        };

        static OnError(div, message) {
            div.empty();
            div.show();
            div.html("<div class='alert alert-danger alert-dismissable fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Lỗi! </strong>" + message + ".  </div>");
            div.delay(6000).hide(0);
        };
        static sha256(str) {
            return sha256(str);
        }
    }
})