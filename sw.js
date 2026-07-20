/* ===== Service Worker — 路由重写 =====
 *  /blog/*  →  /*           (/blog 前缀去根目录取文件)
 *  /        →  academic-index.html  (学术主页)
 * ======================================== */

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  var path = url.pathname;

  // /blog 和 /blog/* → 去掉 /blog 前缀去根目录取文件
  // /blog              → /
  // /blog/             → /
  // /blog/post/xxx/    → /post/xxx/
  if (path === '/blog' || path.indexOf('/blog/') === 0) {
    var target = path.replace(/^\/blog/, '') || '/';
    event.respondWith(fetch(target));
    return;
  }

  // / → academic-index.html（仅页面导航，不拦截静态资源）
  if ((path === '/' || path === '') && event.request.mode === 'navigate') {
    event.respondWith(fetch('/academic-index.html'));
    return;
  }

  // 其余请求（CSS/JS/图片等）保持默认
});
