let baseFont = 100;
let win = window;
let doc = document;
let ua = navigator.userAgent;

let isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
let matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
let isQQ = /\bMQQBrowser\b/.test(ua);
let dpr = win.devicePixelRatio || 1;

//非ios且非qq浏览器
if (!isIos && !(matches && matches[1] > 534) && !isQQ) {
  dpr = 1;
}
let scale = 1 / dpr;

let metaEl = doc.querySelector('meta[name="viewport"]');
document.write(metaEl)
if (!metaEl) {
  metaEl = doc.createElement('meta');
  metaEl.setAttribute('name', 'viewport');
  doc.head.appendChild(metaEl);
}
metaEl.setAttribute('content', 'width=device-width,user-scalable=0,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale);
doc.documentElement.style.fontSize = baseFont / 2 * dpr + 'px';
