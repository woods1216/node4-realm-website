const staticCacheName = [
  '/',
  '/footer.hbs',
  '/header.hbs',
  '/404page',
  '/about',
  '/help',
//  '/history',
  '/index',
  '/utils/forecast.js',
  '/utils/goecode.js',
  '/src/app.js',
  '/css/styles.css',
  '/js/app.js',
  '/img/robot.png',
  '/img/weather.png',
  'access_control.control.mx',
  'access_control.new_commit.cv',
  'access_control.pick_writer.cv',
  'access_control.write',
];
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('first-app')
      .then(function(cache) {
        cache.addAll(staticCacheName);
      })
  );
  //return self.clients.claim();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(krys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      )
    })
  )
})

self.addEventListener('fetch', function(event) {
  console.log(event);
  event.respondWith(
    caches.match(event.request)
      .then(function(res) {
        return res;
      })
  );
});