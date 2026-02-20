// sw.js — very simple offline PWA service worker
self.addEventListener('install', event => {
  console.log('Service Worker Installed');
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
