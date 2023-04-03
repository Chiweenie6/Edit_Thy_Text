const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// //Implementing asset caching

console.log("🎈🎈🎈🎈");

registerRoute(
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "asset-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// self.addEventListener("fetch", (event) => {
//   // Check if this is a navigation request
//   if (event.request.mode === "navigate") {
//     // Open the cache
//     event.respondWith(
//       caches.open(pageCache).then((cache) => {
//         // Check the network first
//         return fetch(event.request.url)
//           .then((fetchedResponse) => {
//             cache.put(event.request, fetchedResponse.clone());

//             return fetchedResponse;
//           })
//           .catch(() => {
//             // If the network is unavailable, get from cache
//             return cache.match(event.request.url);
//           });
//       })
//     );
//   } else {
//     return;
//   }
// });

registerRoute();
