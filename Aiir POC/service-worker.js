self.addEventListener('fetch', function (event) {
  console.log('fetch')
  event.respondWith(fetch(event.request))
})

console.log('Service worker')
